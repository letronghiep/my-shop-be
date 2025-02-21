"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");

const {
  createDiscountService,
  getDiscountAmountService,
  getAllDiscountCodeService,
  getAllDiscountCodeByShopService,
  cancelDiscountCodeService,
  deleteDiscountCodeService,
} = require("../services/discount.service");

const createDiscount = async (req, res, next) => {
  new CREATED({
    message: "Discount is created",
    metadata: await createDiscountService({
      discount_shopId: req.user.userId,
      ...req.body,
    }),
  }).send(res);
};

const getAllDiscountCodes = async (req, res, next) => {
  new SuccessResponse({
    message: "discount amount",
    metadata: await getAllDiscountCodeByShopService({
      shopId: req.user.userId,
      ...req.query,
    }),
  }).send(res);
};

const getDiscountAmount = async (req, res, next) => {
  new SuccessResponse({
    message: "discount amount",
    metadata: await getDiscountAmountService({
      ...req.body,
    }),
  }).send(res);
};
const getAllDiscountCodeWithProducts = async (req, res, next) => {
  new SuccessResponse({
    message: "list  products discount",
    metadata: await getAllDiscountCodeService({
      ...req.query,
    }),
  }).send(res);
};
const cancelDiscountCode = async (req, res, next) => {
  new SuccessResponse({
    message: "Discount code is canceled",
    metadata: await cancelDiscountCodeService({
      discount_shopId: req.user.userId,
      ...req.query,
    }),
  }).send(res);
};

const deleteDiscountCode = async (req, res, next) => {
  new SuccessResponse({
    message: "Discount code is deleted",
    metadata: await deleteDiscountCodeService({
      discount_shopId: req.user.userId,
      ...req.query,
    }),
  }).send(res);
};

module.exports = {
  createDiscount,
  getAllDiscountCodes,
  getDiscountAmount,
  getAllDiscountCodeWithProducts,
  cancelDiscountCode,
  deleteDiscountCode,
};
