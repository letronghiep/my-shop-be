"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
  checkoutReviewService,
  orderByUserService,
  getOrderByUserService,
  getDetailOrderService,
  updateStatusOrderService,
  cancelOrderService,
} = require("../services/checkout.service");

const checkoutReview = async (req, res, next) => {
  // implement checkout review logic here
  new SuccessResponse({
    message: "checkout review",
    metadata: await checkoutReviewService({
      userId: req.user.userId,
      ...req.body,
    }),
  }).send(res);
};
const orderByUser = async (req, res, next) => {
  new SuccessResponse({
    message: "order",
    metadata: await orderByUserService({
      userId: req.user.userId,
      ...req.body,
    }),
  }).send(res);
};

const getOrderByUser = async (req, res, next) => {
  new SuccessResponse({
    message: "get order by user",
    metadata: await getOrderByUserService({
      userId: req.user.userId,
      filter: req.query,
    }),
  }).send(res);
};
const getDetailOrderByUser = async (req, res, next) => {
  new SuccessResponse({
    message: "get order detail by user",
    metadata: await getDetailOrderService({
      userId: req.user.userId,
      orderId: req.params.order_id,
    }),
  }).send(res);
};
// [Shop | admin]
const updateStatusOrder = async (req, res, next) => {
  new SuccessResponse({
    message: "update status order",
    metadata: await updateStatusOrderService({
      userId: req.query.userId,
      orderId: req.query.order_id,
      ...req.body,
    }),
  }).send(res);
};
// [user]
const cancelOrder = async (req, res, next) => {
  new SuccessResponse({
    message: "cancel success",
    metadata: await cancelOrderService({
      orderId: req.params.order_id,
      userId: req.user.userId,
    }),
  }).send(res);
};
module.exports = {
  checkoutReview,
  orderByUser,
  getOrderByUser,
  getDetailOrderByUser,
  updateStatusOrder,
  cancelOrder,
};
