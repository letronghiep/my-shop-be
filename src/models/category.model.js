"use strict";
const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Category";

const COLLECTION_NAME = "categories";
var categorySchema = new Schema(
  {
    category_id: {
      type: Number,
      default: 0,
      unique: true,
      required: true,
    },
    category_name: {
      type: String,
      default: "",
    },
    category_thumb: {
      type: String,
      default: "",
    },
    category_left: {
      type: Number,
      default: 0,
    },
    category_right: {
      type: Number,
      default: 0,
    },
    category_parentId: {
      type: Types.ObjectId,
      ref: DOCUMENT_NAME,
    },
    category_feature: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
module.exports = model(DOCUMENT_NAME, categorySchema);
