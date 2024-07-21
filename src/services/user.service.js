"use strict";

const bcrypt = require("bcrypt");

const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { getListUser, getDetailUser } = require("../models/repo/user.repo");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const Shop = require("../models/shop.model");
const { randomUserId } = require("../utils");
const { default: slugify } = require("slugify");
/**
 * create user [admin]
 * get list user [admin]
 * get user by usr_id [user | shop | admin]
 * update user info [all]
 * block user [admin]
 * update user to shop
 * create Shop
 */

// create user
const createUserService = async ({
  usr_id = randomUserId(),
  usr_name,
  usr_slug,
  usr_full_name,
  usr_password,
  usr_salt,
  usr_email,
  usr_phone,
  usr_sex,
  usr_avatar,
  usr_date_of_birth,
  usr_role,
  usr_status,
}) => {
  try {
    const foundUser = await User.findOne({
      usr_id: usr_id,
    }).lean();
    if (foundUser) throw new AuthFailureError("Người dùng đã tồn tại");
    const passwordHash = await bcrypt.hash(usr_password, 10);
    const newUser = await User.create({
      usr_id,
      usr_name,
      usr_slug,
      usr_full_name,
      usr_password: passwordHash,
      usr_salt,
      usr_email,
      usr_phone,
      usr_sex,
      usr_avatar,
      usr_date_of_birth,
      usr_role,
      usr_status,
    });
    return newUser ? newUser : null;
  } catch (error) {
    throw error;
  }
};
// update user info
const updateUserService = async ({
  _id,
  usr_id,
  usr_name,
  usr_slug,
  usr_full_name,
  usr_password,
  usr_salt,
  usr_email,
  usr_phone,
  usr_sex,
  usr_avatar,
  usr_date_of_birth,
  usr_role,
  usr_status,
}) => {
  const foundUser = await User.findOne({
    _id: _id,
  });
  if (!foundUser) throw new NotFoundError("Không tìm thấy người dùng");
  // const passwordHash = await bcrypt.hash(usr_password, 10);
  const data = await User.findByIdAndUpdate(_id, {
    $set: {
      usr_id,
      usr_name,
      usr_slug: slugify(usr_name, { lower: true }),
      usr_full_name,
      usr_password,
      usr_salt,
      usr_email,
      usr_phone,
      usr_sex,
      usr_avatar,
      usr_date_of_birth,
      usr_role,
      usr_status,
      updatedAt: new Date(),
    },
  });
  return data;
};

// block user
const blockUserService = async ({ id }) => {
  try {
    const foundUser = await User.findOne({
      _id: id,
    });
    if (!foundUser) throw new AuthFailureError("Người dùng không tồn tại");
    await User.findByIdAndUpdate(id, { $set: { usr_status: "block" } });
    await Shop.findByIdAndUpdate(foundUser.usr_id, {
      $set: { status: "block" },
    });
    return 1;
  } catch (error) {}
};

// get list user
const getListUserService = async ({
  limit = 50,
  sort = "ctime",
  page = 1,
  filter = {},
}) => {
  const roles = await Role.find({
    rol_name: { $in: ["shop", "user"] },
  }).select("_id");
  // Lấy danh sách các ID vai tròs
  const roleIds = roles.map((role) => role._id);
  filter = { usr_role: { $in: roleIds } };
  return await getListUser({
    limit,
    sort,
    page,
    filter,
  });
};

// update user to shop
const updateUserToShopService = async ({
  usr_id,
  usr_name,
  usr_full_name,
  usr_password,
  usr_email,
  usr_phone,
  usr_role,
  usr_status,
  received_address,
  sent_address,
}) => {
  try {
    const roleShop = await Role.findOne({
      rol_name: "shop",
    });
    const foundUser = await User.findOne({
      usr_id,
    });
    if (foundUser) {
      const newShop = await Shop.create({
        _id: foundUser._id,
        usr_id: foundUser.usr_id,
        shop_name: foundUser.usr_name,
        password: foundUser.usr_password,
        email: foundUser.usr_email,
        received_address: received_address,
        sent_address,
        phone: foundUser.usr_phone,
        avatar: foundUser.usr_avatar,
        role: roleShop._id,
        status: foundUser.usr_status,
      });
      await User.findByIdAndUpdate(foundUser._id, {
        $set: {
          usr_role: roleShop._id,
          updatedAt: new Date(),
        },
      });
      return newShop;
    } else {
      const user = await createUserService({
        usr_id: randomUserId(),
        usr_name,
        usr_full_name,
        usr_password,
        usr_email,
        usr_phone,
        usr_role: roleShop._id,
        usr_status: "active",
      });
      const shop = await Shop.create({
        _id: user._id,
        usr_id: user.usr_id,
        shop_name: user.usr_name,
        password: user.usr_password,
        email: user.usr_email,
        received_address: received_address,
        sent_address,
        phone: user.usr_phone,
        avatar: user.usr_avatar,
        role: roleShop._id,
        status: user.usr_status,
      });
      return shop;
    }
  } catch (error) {
    throw error;
  }
};

// get user by usr_id
const getDetailUserService = async (user_id) => {
  console.log("ser", user_id);
  return await getDetailUser({ user_id });
};

module.exports = {
  createUserService,
  getListUserService,
  getDetailUserService,
  updateUserService,
  blockUserService,
  updateUserToShopService,
};
