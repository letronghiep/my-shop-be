"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response");
const {
  createProductService,
  getAllProductService,
  getAllPublishedProductsService,
  getAllDraftProductsService,
  publishedProductService,
  draftProductService,
  blockProductService,
  deleteProductService,
  updateProductService,
  getDetailProductService,
  getListProductByShopService,
  searchProductService,
} = require("../services/product.service");

// user
const getAllProduct = async (req, res, next) => {
  new SuccessResponse({
    message: "List product",
    metadata: await getAllProductService(req.query),
  }).send(res);
};

const getProductById = async (req, res, next) => {
  new SuccessResponse({
    message: "Detail product",
    metadata: await getDetailProductService({
      product_id: req.params.product_id,
    }),
  }).send(res);
};

const getListProductByShop = async (req, res, next) => {
  console.log(req.params);
  new SuccessResponse({
    message: "List product by shop",
    metadata: await getListProductByShopService(req.params),
  }).send(res);
};
const searchProduct = async (req, res, next) => {
  new SuccessResponse({
    message: "Search product",
    metadata: await searchProductService(req.query),
  }).send(res);
};
const createProductByShop = async (req, res, next) => {
  const product = await createProductService({
    product_shop: req.user.userId,
    ...req.body,
  });
  new CREATED({
    message: "Product created",
    metadata: product,
  }).send(res);
};
const createProductByAdmin = async (req, res, next) => {
  new CREATED({
    message: "Product created",
    metadata: await createProductService({
      ...req.body,
    }),
  }).send(res);
};

const publishedProductByShop = async (req, res, next) => {
  new SuccessResponse({
    message: "Published success",
    metadata: await publishedProductService({
      product_id: req.params.product_id,
      product_shop: req.user.userId,
    }),
  }).send(res);
};

const publishedProductByAdmin = async (req, res, next) => {
  new SuccessResponse({
    message: "Published success",
    metadata: await publishedProductService({
      product_id: req.query.product_id,
      product_shop: req.query.product_shop,
    }),
  }).send(res);
};
// draft
const draftProductByShop = async (req, res, next) => {
  new SuccessResponse({
    message: "draft success",
    metadata: await draftProductService({
      product_id: req.params.product_id,
      product_shop: req.user.userId,
    }),
  }).send(res);
};

const draftProductByAdmin = async (req, res, next) => {
  new SuccessResponse({
    message: "draft success",
    metadata: await draftProductService({
      product_id: req.query.product_id,
      product_shop: req.query.product_shop,
    }),
  }).send(res);
};

//block

const blockProductByShop = async (req, res, next) => {
  new SuccessResponse({
    message: "block success",
    metadata: await blockProductService({
      product_id: req.params.product_id,
      product_shop: req.user.userId,
    }),
  }).send(res);
};

const blockProductByAdmin = async (req, res, next) => {
  new SuccessResponse({
    message: "draft success",
    metadata: await blockProductService({
      product_id: req.query.product_id,
      product_shop: req.query.product_shop,
    }),
  }).send(res);
};

// update product
const updateProductByShop = async (req, res, next) => {
  new SuccessResponse({
    message: "update success",
    metadata: await updateProductService({
      product_id: req.params.product_id,
      product_shop: req.user.userId,
      ...req.body,
    }),
  }).send(res);
};

const deleteProductByShop = async (req, res, next) => {
  new SuccessResponse({
    message: "deleted success",
    metadata: await deleteProductService({
      product_id: req.params.product_id,
      product_shop: req.user.userId,
    }),
  }).send(res);
};

const deleteProductByAdmin = async (req, res, next) => {
  new SuccessResponse({
    message: "deleted success",
    metadata: await deleteProductService({
      product_id: req.query.product_id,
      product_shop: req.query.product_shop,
    }),
  }).send(res);
};

const getAllPublishedProduct = async (req, res, next) => {
  new SuccessResponse({
    message: "List published products",
    metadata: await getAllPublishedProductsService({
      product_shop: req.user.userId,
    }),
  }).send(res);
};
const getAllDraftProduct = async (req, res, next) => {
  new SuccessResponse({
    message: "List published products",
    metadata: await getAllDraftProductsService({
      product_shop: req.user.userId,
    }),
  }).send(res);
};

module.exports = {
  createProductByShop,
  updateProductByShop,
  publishedProductByShop,
  draftProductByShop,
  blockProductByShop,
  deleteProductByShop,

  createProductByAdmin,
  publishedProductByAdmin,
  draftProductByAdmin,
  blockProductByAdmin,
  deleteProductByAdmin,
  getAllProduct,
  getAllPublishedProduct,
  getAllDraftProduct,
  getListProductByShop,
  getProductById,
  searchProduct,
};
