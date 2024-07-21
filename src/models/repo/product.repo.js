"use strict";
const Product = require("../product.model");
const getProductById = async ({ productId }) => {
  return await Product.findOne({
    _id: productId,
  });
};

const foundProductByShop = async ({ product_id, product_shop }) => {
  return await Product.findOne({
    product_shop: product_shop,
    _id: product_id,
  });
};
module.exports = {
  getProductById,
  foundProductByShop
};
