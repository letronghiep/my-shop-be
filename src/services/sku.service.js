"use strict";

const _ = require("lodash");

const { randomProductId } = require("../utils");
/**
 * create sku
 * get single sku
 * get sku list by product_id
 * set default sku by product_id
 */
const Sku = require("../models/sku.model");
const { NotFoundError } = require("../core/error.response");
const createSkuService = async ({ product_id, sku_list }) => {
  try {
    const convert_sku_list = sku_list.map((sku) => {
      return {
        ...sku,
        product_id: product_id,
        sku_id: `${product_id}.${randomProductId()}`,
      };
    });
    const skues = await Sku.create(convert_sku_list);
    return skues;
  } catch (error) {
    console.log("Có lỗi trong quá trình tạo::", error);
    return [];
  }
};

const updateSkuService = async ({ product_id, sku_list }) => {
  if (!sku_list.length) return;
  for (const sku of sku_list) {
    await Sku.updateOne(
      { product_id: sku.product_id },
      {
        $set: {
          sku_id: `${product_id}.${randomProductId()}`,
          sku_default: sku.sku_default,
          sku_price: sku.sku_price,
          sku_stock: sku.sku_stock,
          product_id: product_id,
        },
      },
      {
        upsert: true,
      }
    );
  }
};

const getAllSkuService = async ({ product_id }) => {
  try {
    const skues = await Sku.find({
      product_id: product_id,
    }).lean();
    return skues;
  } catch (error) {
    console.log("Có l��i trong quá trình lấy danh sách::", error);
    return [];
  }
};
const getSingleSkuService = async ({ product_id, sku_id }) => {
  try {
    const sku = await Sku.findOne({
      sku_id,
      product_id,
    }).lean();
    return _.omit(sku, ["__v", "createdAt", "updatedAt", "isDeleted"]);
  } catch (error) {
    console.log("Có lỗi xảy ra::", error);
    return null;
  }
};

const setDefaultSkuService = async ({ product_id, sku_id }) => {
  try {
    const foundSku = await Sku.findOne({
      sku_id,
      product_id,
    });
    if (!foundSku) throw new NotFoundError("Không tìm thấy sản phẩm");
    const { modifiedCount } = foundSku.updateOne(
      {
        $set: {
          sku_default: true,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
    return modifiedCount;
  } catch (error) {
    console.log("Có l��i trong quá trình thiết lập mặc đ��nh::", error);
    return 0;
  }
};
module.exports = {
  createSkuService,
  updateSkuService,
  getAllSkuService,
  getSingleSkuService,
  setDefaultSkuService,
};
