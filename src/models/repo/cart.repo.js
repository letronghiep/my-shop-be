"use strict";
const Cart = require("../cart.model");
const findCartById = async ({ cartId }) => {
  return await Cart.findOne({
    _id: cartId,
    cart_state: "active",
  });
};
module.exports = {
    findCartById,
}