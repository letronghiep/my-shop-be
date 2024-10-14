"use strict";

const express = require("express");
const router = express.Router();

const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../middlewares/authentication");
const {
  listNotifyByUser,
} = require("../../controllers/notification.controller");
router.use(authentication);
router.get("", asyncHandler(listNotifyByUser));
module.exports = router;
