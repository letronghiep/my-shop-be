"use strict";

const express = require("express");
const router = express.Router();

const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../middlewares/authentication");
const {
  checkoutReview,
  orderByUser,
  getOrderByUser,
  getDetailOrderByUser,
  updateStatusOrder,
  cancelOrder,
} = require("../../controllers/checkout.controller");

router.use(authentication);
router.post("/review", asyncHandler(checkoutReview));
router.post("", asyncHandler(orderByUser));
router.get("", asyncHandler(getOrderByUser));
router.get("/:order_id", asyncHandler(getDetailOrderByUser));
router.patch("/", asyncHandler(updateStatusOrder));
router.patch("/canceled/:order_id", asyncHandler(cancelOrder));
module.exports = router;
