"use strict";
const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "orders";

// Declare the Schema of the Mongo model

var orderSchema = new Schema(
  {
    order_userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    order_id: {
      type: String,
      required: true,
      unique: true,
    },
    order_checkout: {
      type: Object,
      default: {},
    },
    /*
            order_checkout: {
                totalPrice,
                totalApplyDiscount,
                feeShip
            }
    */
    order_shipping: {
      type: Object,
      default: {},
    },
    /*
    order_shipping: {
        street,
        city,
        state,
        country
    }

    */
    order_payment: {
      type: Object,
      default: {},
    },
    /* 
    order_payment: {
        paymentMethod,
        paymentGateway,
        paymentToken
    }
*/
    order_products: { type: Array, required: true },
    order_trackingNumber: {
      type: String,
      default: "#000118052022",
    },
    order_status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "cancelled",
        "delivering",
        "refunded",
      ],
      default: "pending",
    },
  },

  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, orderSchema);
