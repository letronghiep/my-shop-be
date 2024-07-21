"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response");
const {
  createUserService,
  getListUserService,
  getDetailUserService,
  updateUserService,
  updateUserToShopService,
} = require("../services/user.service");
const createUser = async (req, res, next) => {
  new CREATED({
    message: "User created",
    metadata: await createUserService(req.body),
  }).send(res);
};
const listUser = async (req, res, next) => {
  new SuccessResponse({
    message: "List User",
    metadata: await getListUserService(req.query),
  }).send(res);
};
const detailUser = async (req, res, next) => {
  console.log(req.params);
  new SuccessResponse({
    message: "Detail User",
    metadata: await getDetailUserService(req.params.user_id),
  }).send(res);
};

const updateUser = async (req, res, next) => {
  console.log(req.body);
  new SuccessResponse({
    message: "Update User",
    metadata: await updateUserService({
      _id: req.params.usr_id,
      ...req.body,
    }),
  }).send(res);
};
const createShop = async (req, res, next) => {
  new SuccessResponse({
    message: "Shop created",
    metadata: await updateUserToShopService(req.body),
  }).send(res);
};
module.exports = {
  createUser,
  listUser,
  detailUser,
  updateUser,
  createShop
};
