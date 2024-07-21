"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const {
  createCategory,
  getCategoryByParentId,
  deleteCategory,
  getCategoryById,
} = require("../../controllers/category.controller");
const router = express.Router();

router.post("/", asyncHandler(createCategory));
router.get("/", asyncHandler(getCategoryByParentId));
router.delete("/:category_id", asyncHandler(deleteCategory));
router.get("/:category_id", asyncHandler(getCategoryById));

module.exports = router;
