"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const {
  createUser,
  listUser,
  detailUser,
  updateUser,
  createShop,
  getMe,
} = require("../../controllers/user.controller");
const {
  authentication,
  isAdmin,
  checkAdmin,
} = require("../../middlewares/authentication");
const router = express.Router();
router.get("/me", authentication, asyncHandler(getMe));
router.get("/:user_id", asyncHandler(detailUser));
// middlewares to authenticate the request
router.post("/", authentication, isAdmin, asyncHandler(createUser));
router.put("/update/:usr_id", authentication, asyncHandler(updateUser));
router.get("/", authentication, isAdmin, asyncHandler(listUser));

router.post("/seller", asyncHandler(createShop));
module.exports = router;
