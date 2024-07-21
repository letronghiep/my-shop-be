"use strict";
const ApiKey = require("../models/apikey.model");
const crypto = require("node:crypto");
const findById = async (key) => {
  // const apiKey = await ApiKey.create({
  //   key: crypto.randomBytes(64).toString("hex"),
  //   permissions: ["0000"],
  // });
  // console.log(apiKey);
  const objKey = await ApiKey.findOne({
    key,
    status: true,
  }).lean();
  return objKey;
};
module.exports = {
  findById,
};
