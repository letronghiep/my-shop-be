"use strict";
const { model, Schema, Types } = require("mongoose");
const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "comments";
var commentSchema = new Schema(
  {
    comment_productId: {
      type: Types.ObjectId,
      ref: "Product",
    },
    comment_userId: {
      type: Types.ObjectId,
      ref: "User",
    },
    comment_content: {
      type: String,
      default: "",
    },
    comment_left: {
      type: Number,
      default: 0,
    },

    comment_right: {
      type: Number,
      default: 0,
    },
    comment_parentId: {
      type: Types.ObjectId,
      ref: DOCUMENT_NAME,
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
module.exports = model(DOCUMENT_NAME, commentSchema);
