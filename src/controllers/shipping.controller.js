"use strict";
const { SuccessResponse, CREATED } = require("../core/success.response");
const {
  getListAddressByUser,
  createAddressByUser,
  updateShippingService,
  removeShippingService,
} = require("../services/shipping.service");
const getListShipping = async (req, res, next) => {
  const address = await getListAddressByUser({
    user_id: req.user.userId,
    ...req.query,
  });
  new SuccessResponse({
    message: "Get list address success",
    metadata: await address,
  }).send(res);
};
const createShipping = async (req, res, next) => {
  new CREATED({
    message: "Create address success",
    metadata: await createAddressByUser({
      user_id: req.user.userId,
      ...req.body,
    }),
  }).send(res);
};
const updateShipping = async (req, res, next) => {
  new SuccessResponse({
    message: "Update shipping information successfully",
    metadata: await updateShippingService({
      user_id: req.user.userId,
      shipping_id: req.params.shipping_id,
      ...req.body,
    }),
  }).send(res);
};
const removeShipping = async (req, res, next) => {
  new SuccessResponse({
    message: "Remove shipping information successfully",
    metadata: await removeShippingService({
      user_id: req.user.userId,
      shipping_id: req.params.shipping_id,
    }),
  }).send(res);
};
module.exports = {
  getListShipping,
  createShipping,
  updateShipping,
  removeShipping,
};
