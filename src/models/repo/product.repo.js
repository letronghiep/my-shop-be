"use strict";
const { getSelectData } = require("../../utils");
const Product = require("../product.model");
const getProductById = async ({ productId }) => {
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
  return await Product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
}
const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById({
        productId: product.productId,
      });
      if (foundProduct)
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          productId: product.productId,
        };
    })
  );
};
const updateStatusProduct = async ({
  product_id,
  product_shop,
  isDraft,
  isPublished,
}) => {
  // check product exists
  const foundProduct = await foundProductByShop({ product_id, product_shop });
  if (!foundProduct) throw new NotFoundError("Sản phẩm không tồn tại");
  // update product
  foundProduct.isDraft = isDraft;
  foundProduct.isPublished = isPublished;
  await Sku.updateMany({
    product_id: product_id,
  });
  return await Product.findByIdAndUpdate(product_id, foundProduct, {
    new: true,
  });
};
module.exports = {
  getProductById,
  foundProductByShop,
  findAllProduct,
  checkProductByServer,
  updateStatusProduct,
};
