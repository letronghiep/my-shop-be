"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response");
const {
  createCategoryService,
  getCategoryByParentIdService,
  deleteCategoryService,
  getCategoryByIdService,
} = require("../services/category.service");
const createCategory = async (req, res, next) => {
  await new CREATED({
    message: "Category created",
    metadata: await createCategoryService(req.body),
  }).send(res);
};
const getCategoryByParentId = async (req, res, next) => {
  console.log(req.query);
  new SuccessResponse({
    message: "List Category",
    metadata: await getCategoryByParentIdService(req.query),
  }).send(res);
};
const deleteCategory = async (req, res, next) => {
  console.log(req.params);
  new SuccessResponse({
    message: "deleted Category",
    metadata: await deleteCategoryService({
      category_id: req.params.category_id,
    }),
  }).send(res);
};
const getCategoryById = async (req, res, next) => {
  new SuccessResponse({
    message: "deleted Category",
    metadata: await getCategoryByIdService({
      category_id: req.params.category_id,
    }),
  }).send(res);
};
module.exports = {
  createCategory,
  getCategoryByParentId,
  deleteCategory,
  getCategoryById
};
