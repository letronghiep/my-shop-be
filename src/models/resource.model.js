"use strict";
const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Resource";
const COLLECTION_NAME = "resources";

// Declare the Schema of the Mongo model

var resourceSchema = new Schema(
  {
    src_name: {
      type: String,
      required: true,
    },
    src_slug: {
      type: String,
      required: true,
    },
    src_description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, resourceSchema);
