"use strict";
const { paginate } = require("../helpers/paginate");
const Notification = require("../models/notification.model");
const {
  getListAddress,
  getPaginateAddressList,
  updateShippingInCache,
} = require("../models/repo/shipping.repo");
const { findOneUser, getAdmin } = require("../models/repo/user.repo");
const Shipping = require("../models/shipping.model");
const { randomShippingId } = require("../utils");
const RedisPubsubService = require("../services/redisPubsub.service");
const { getIORedis } = require("../db/init.ioredis");
const { CACHE_SHIPPING } = require("../configs/constant");
const { NotFoundError } = require("../core/error.response");
const { Types } = require("mongoose");
const { clearCacheIO } = require("../models/repo/cache.repo");
const { getIO } = require("../db/init.socket");
const { listenRedis } = require("../services/redisListener.service");
const { shippingConfig } = require("../configs/event.config");
const { shippingCreated, shippingUpdated, shippingDeleted } = shippingConfig;
const io = getIO();
// Get shipping information by shipping_id
const redisPubsub = new RedisPubsubService();
const getListAddressByUser = async ({
  user_id,
  limit = 50,
  sort = "ctime",
  page = 1,
  filter = {},
}) => {
  if (!user_id) return null;
  return await getPaginateAddressList({
    limit,
    sort,
    page,
    filter: { user_id: user_id },
  });
};
const createAddressByUser = async ({
  user_id,
  name,
  phone,
  address,
  city,
  district,
  state,
  country,
  zip,
  geo_info,
  is_delivery_address,
  is_return_address,
}) => {
  const foundUser = await findOneUser({
    _id: new Types.ObjectId(user_id),
    usr_status: "active",
  });
  if (!foundUser) throw new NotFoundError("Người dùng không tồn tại");
  const newAddress = await Shipping.create({
    user_id,
    shipping_id: randomShippingId(),
    name,
    phone,
    address,
    city,
    district,
    state,
    country,
    zip,
    geo_info,
    is_delivery_address,
    is_return_address,
  });
  const addressKeyCache = `${CACHE_SHIPPING["SHIPPING-LIST"]}:*`;
  redisPubsub.publish(shippingCreated.event, JSON.stringify(newAddress));
  // const addressList = JSON.parse(getIORedis(addressKeyCache));
  await clearCacheIO({ key: addressKeyCache });
  return newAddress;
};
const updateShippingService = async ({
  user_id,
  shipping_id,
  name,
  phone,
  address,
  city,
  district,
  state,
  country,
  zip,
  geo_info,
  is_delivery_address,
  is_return_address,
}) => {
  // Update logic here
  const user = await findOneUser({
    _id: new Types.ObjectId(user_id),
    usr_status: "active",
  });
  if (!user) {
    throw new NotFoundError("Người dùng không tồn tại");
  }
  const shippingUpdate = {
    name,
    phone,
    address,
    city,
    district,
    state,
    country,
    zip,
    geo_info,
    is_delivery_address,
    is_return_address,
  };
  const shipping = await Shipping.findOneAndUpdate(
    { user_id: user_id, _id: shipping_id },
    shippingUpdate,
    { new: true, upsert: true }
  );
  await updateShippingInCache({
    shippingId: shipping._id,
    updatedShipping: shipping,
  });

  await redisPubsub.publish(shippingUpdated.event, JSON.stringify(shipping));

  return shipping;
};
const removeShippingService = async ({ user_id, shipping_id }) => {
  // Delete logic here
  const user = await findOneUser({
    _id: new Types.ObjectId(user_id),
    usr_status: "active",
  });
  if (!user) {
    throw new NotFoundError("Người dùng không tồn tại");
  }
  const shippingDelete = await Shipping.findOneAndDelete({
    user_id: user_id,
    _id: shipping_id,
  });
  await redisPubsub.publish(
    shippingDeleted.event,
    JSON.stringify(shippingDelete)
  );
  return true;
};
listenRedis();

module.exports = {
  getListAddressByUser,
  createAddressByUser,
  updateShippingService,
  removeShippingService,
};
