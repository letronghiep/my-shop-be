"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const {
  getDiscountAmount,
  getAllDiscountCodeWithProducts,
  createDiscount,
  getAllDiscountCodes,
  cancelDiscountCode,
  deleteDiscountCode,
} = require("../../controllers/discount.controller");
const { authentication } = require("../../middlewares/authentication");
const router = express.Router();

router.post("/amount", asyncHandler(getDiscountAmount));
router.get("/list_product_code", asyncHandler(getAllDiscountCodeWithProducts));
router.use(authentication);
router.post("", asyncHandler(createDiscount));
router.get("", asyncHandler(getAllDiscountCodes));
router.put("/cancel", asyncHandler(cancelDiscountCode));
router.delete("/", asyncHandler(deleteDiscountCode));
module.exports = router;
