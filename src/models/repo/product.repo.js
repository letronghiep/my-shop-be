"use strict";
const { getSelectData } = require("../../utils");
const Product = require("../product.model");
const getProductById = async ({ productId }) => {
  console.log(productId);
  return await Product.findOne({
    _id: productId,
    isPublished: true,
  }).lean();
};

const foundProductByShop = async ({ product_id, product_shop }) => {
  return await Product.findOne({
    product_shop: product_shop,
    _id: product_id,
  });
};
async function findAllProduct({ limit, sort, page, filter, select }) {
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const skip = (page - 1) * limit;
  return await Product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
}
module.exports = {
  getProductById,
  foundProductByShop,
  findAllProduct,
};
