"use strict";

const express = require("express");
const router = express.Router();

const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../middlewares/authentication");
const { checkoutReview, orderByUser } = require("../../controllers/checkout.controller");

router.use(authentication);
router.post("/review", asyncHandler(checkoutReview));
router.post("", asyncHandler(orderByUser));
module.exports = router;
