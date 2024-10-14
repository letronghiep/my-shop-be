"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../middlewares/authentication");
const { uploadFile } = require("../../controllers/upload.controller");
const router = express.Router();

router.use(authentication);
router.post("/product", asyncHandler(uploadFile));
module.exports = router;
