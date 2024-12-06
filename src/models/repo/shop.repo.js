"use strict";
const Shop = require("../shop.model");
const findShopById = async ({ filter }) => {
  console.log(filter)
  return await Shop.findOne({ filter });
};

module.exports = {
  findShopById,
};
