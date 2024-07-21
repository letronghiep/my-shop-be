"use strict";
const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "shops";
const { model, Schema, Types } = require("mongoose");

var shopSchema = new Schema(
  {
    usr_id: {
      type: Number,
      required: true,
      unique: true,
    },
    shop_name: {
      type: String,
      unique: true,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    received_address: {
      type: String,
      default: "",
    },
    sent_address: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: Types.ObjectId,
      ref: "Role",
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "block"],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

shopSchema.index({ name: "text" });

module.exports = model(DOCUMENT_NAME, shopSchema);
