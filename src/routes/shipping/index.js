"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const {
  getListShipping,
  createShipping,
  updateShipping,
  removeShipping,
} = require("../../controllers/shipping.controller");
const {
  authentication,
  isAdmin,
  checkAdmin,
} = require("../../middlewares/authentication");
const router = express.Router();
router.get("/", authentication, asyncHandler(getListShipping));
router.post("/", authentication, asyncHandler(createShipping));
router.patch('/:shipping_id', authentication, asyncHandler(updateShipping))
router.delete('/:shipping_id', authentication, asyncHandler(removeShipping));
module.exports = router;
