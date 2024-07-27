"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
  checkoutReviewService,
  orderByUserService,
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
module.exports = {
  checkoutReview,
  orderByUser,
};
