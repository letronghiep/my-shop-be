"use strict";

const DOCUMENT_NAME = "Sku";
const COLLECTION_NAME = "skus";

const { model, Types, Schema } = require("mongoose");
var skuSchema = new Schema(
  {
    sku_id: {
      type: String,
      required: true,
      unique: true,
    },
    sku_tier_idx: {
      type: Array,
      default: [],
    },
    sku_default: {
      type: Boolean,
      default: false,
    },
    sku_slug: {
      type: String,
      default: "",
    },
    sku_sort: {
      type: Number,
      default: 0,
    },
    sku_price: {
      type: String,
      required: true,
    },
    sku_price_sale: {
      type: String,
      default: "0",
    },
    sku_stock: {
      type: Number,
      default: 0,
    },
    product_id: {
      type: Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamp: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, skuSchema);
