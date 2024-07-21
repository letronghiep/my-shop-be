"use strict";
const { NotFoundError } = require("../core/error.response");
const { paginate } = require("../helpers/paginate");
const Product = require("../models/product.model");
const Shop = require("../models/shop.model");
const Sku = require("../models/sku.model");
const {
  insertInventory,
  updateInventory,
} = require("../models/repo/inventory.repo");
const { findShopById } = require("../models/repo/shop.repo");
const { randomProductId } = require("../utils");
const { createSkuService, updateSkuService } = require("./sku.service");
const {
  foundProductByShop,
  getProductById,
} = require("../models/repo/product.repo");
const { filter } = require("lodash");
/**
 * createProduct
 * getAllProduct
 * getProductIsDraft
 * getProductIsPublished
 * publishedProduct [shop | admin]
 * draft Product [shop | admin]
 * block product [admin]
 * delete product [admin | shop]
 * update product [admin | shop]
 */

// create product

const createProductService = async ({
  product_name,
  product_thumb,
  product_description,
  product_price,
  product_category,
  product_quantity,
  product_shop,
  product_attributes,
  product_ratingAvg,
  product_variations,
  sku_list = [],
}) => {
  // 1. check shop exists or active
  const foundShop = findShopById({
    filter: {
      _id: product_shop,
      status: "active",
    },
  });
  if (!foundShop) throw new NotFoundError("Shop chưa được đăng ký");
  // 2. create product
  const product = await Product.create({
    product_id: randomProductId(),
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_category,
    product_quantity,
    product_shop,
    product_attributes,
    product_ratingAvg,
    product_variations,
  });
  if (product && sku_list.length) {
    createSkuService({
      sku_list,
      product_id: product.product_id,
    }).then();
    const total_stock = sku_list.reduce(
      (total, sku) => (total += sku.sku_stock),
      0
    );
    product.product_quantity = total_stock;
  }
  // product.product_price =
  await insertInventory({
    productId: product._id,
    shopId: product.product_shop,
    location: "",
    stock: product.product_quantity,
  });
  // product.product_quantity = await Product.
  return product;
};

// publishedProduct

const publishedProductService = async ({ product_id, product_shop }) => {
  console.log("result::", { product_id, product_shop });
  // check product exists
  const foundProduct = await foundProductByShop({ product_id, product_shop });
  if (!foundProduct) throw new NotFoundError("Sản phẩm không tồn tại");
  // update product
  foundProduct.isDraft = false;
  foundProduct.isPublished = true;
  await Sku.updateMany({
    product_id: product_id,
  });
  return await Product.findByIdAndUpdate(product_id, foundProduct, {
    new: true,
  });
};

// draft product

const draftProductService = async ({ product_id, product_shop }) => {
  // check product exists
  const foundProduct = await foundProductByShop({ product_id, product_shop });
  if (!foundProduct) throw new NotFoundError("Sản phẩm không tồn tại");
  // update product
  foundProduct.isPublished = false;
  foundProduct.isDraft = true;
  return await Product.findByIdAndUpdate(product_id, foundProduct, {
    new: true,
  });
};

// block product
const blockProductService = async ({ product_id, product_shop }) => {
  const foundProduct = await foundProductByShop({ product_id, product_shop });
  if (!foundProduct) throw new NotFoundError("Sản phẩm không tồn tại");
  foundProduct.isBlocked = true;
  return await Product.findByIdAndUpdate(product_id, foundProduct, {
    new: true,
  });
};

// delete product [admin | shop]

const deleteProductService = async ({ product_id, product_shop }) => {
  const deletedProduct = await Product.findByIdAndDelete({
    _id: product_id,
    product_shop: product_shop,
  });
  await Sku.deleteMany({
    product_id: product_id,
  });
  return deletedProduct;
};

// update product
const updateProductService = async ({
  product_id,
  product_name,
  product_thumb,
  product_description,
  product_price,
  product_category,
  product_quantity,
  product_shop,
  product_attributes,
  product_ratingAvg,
  product_variations,
  sku_list = [],
}) => {
  // check exists product
  const foundProduct = await foundProductByShop({
    product_id: product_id,
    product_shop,
  });
  if (!foundProduct) throw new NotFoundError("Không tìm thấy sản phẩm");
  // update product
  foundProduct.product_name = product_name;
  foundProduct.product_thumb = product_thumb;
  foundProduct.product_description = product_description;
  foundProduct.product_price = product_price;
  foundProduct.product_category = product_category;
  foundProduct.product_quantity = product_quantity;
  foundProduct.product_attributes = product_attributes;
  foundProduct.product_ratingAvg = product_ratingAvg;
  foundProduct.product_variations = product_variations;
  const filter = {
    product_id: foundProduct.product_id,
  };
  // sku_list.map(async (sku) => {
  //   return await Sku.updateOne(
  //     filter,
  //     {
  //       $set: {
  //         sku_id: sku.sku_id,
  //         sku_default: sku.sku_default,
  //         sku_price: sku.sku_price,
  //         sku_stock: sku.sku_stock,
  //         product_id: product_id,
  //       },
  //     },
  //     {
  //       upsert: true,
  //       new: true,
  //     }
  //   );
  // });
  // await updateSkuService({
  //   product_id: product_id,
  //   sku_list,
  // });
  // await 
  const total_stock = sku_list.reduce(
    (total, sku) => (total += sku.sku_stock),
    0
  );
  foundProduct.product_quantity = total_stock;
  await updateInventory({
    productId: foundProduct._id,
    shopId: foundProduct.product_shop,
    location: "",
    stock: foundProduct.product_quantity,
  });
  return await Product.findByIdAndUpdate(
    { _id: product_id, product_shop: product_shop },
    foundProduct,
    {
      new: true,
    }
  );
};

// QUERY
// get all product for user
const getAllProductService = async ({
  filter = { isPublished: true },
  limit = 50,
  sort = "ctime",
  page = 1,
}) => {
  return await paginate({
    model: Product,
    filter,
    limit,
    page,
    sort,
    select: [
      "product_name",
      "product_thumb",
      "product_price",
      "product_ratingAvg",
    ],
  });
};

const getAllPublishedProductsService = async ({
  product_shop,
  filter = { product_shop, isPublished: true },
  limit = 50,
  sort = "ctime",
  page = 1,
}) => {
  return await paginate({
    model: Product,
    filter,
    limit,
    page,
    sort,
  });
};

const getAllDraftProductsService = async ({
  product_shop,
  filter = { product_shop, isDraft: true },
  limit = 50,
  sort = "ctime",
  page = 1,
}) => {
  return await paginate({
    model: Product,
    filter,
    limit,
    page,
    sort,
  });
};
// END QUERY
module.exports = {
  createProductService,
  updateProductService,
  draftProductService,
  publishedProductService,
  blockProductService,
  deleteProductService,
  getAllProductService,
  getAllPublishedProductsService,
  getAllDraftProductsService,
};
