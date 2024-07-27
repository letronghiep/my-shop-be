"use strict";
const Cart = require("../models/cart.model");
const { getProductById } = require("../models/repo/product.repo");
const { NotFoundError } = require("../core/error.response");

// REPO
const createUserCart = async ({ userId, product }) => {
  const query = {
      cart_userId: userId,
      cart_state: "active",
    },
    updateSet = {
      $addToSet: {
        cart_products: product,
      },
    },
    options = {
      upsert: true,
      new: true,
    };
  return await Cart.findOneAndUpdate(query, updateSet, options);
};
const updateUserCartQuantity = async ({ userId, product }) => {
  const { productId, quantity } = product;
  const query = {
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    },
    updateSet = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    },
    options = {
      upsert: true,
      new: true,
    };
  return Cart.findOneAndUpdate(query, updateSet, options);
};
// END REPO

const addToCartService = async ({ userId, product }) => {
  console.log("product::", product);
  const userCart = await Cart.findOne({
    cart_userId: userId,
  });
  // chua co cart
  if (!userCart) {
    return await createUserCart({ userId, product });
  }
  console.log(userCart);
  // co gio hang nhung chua co san pham
  if (!userCart.cart_products.length) {
    userCart.cart_products = [product];
    return await userCart.save();
  }
  // gio hang ton tai va co san pham thi update quantity\
  return await updateUserCartQuantity({ userId, product });
};

/* 
    shop_order_ids: [
        {
        shopId,
        item_products: [
        {
            quantity, 
            shopId,
            old_quantity,
            product_id
        }
            
        ],
    }
    ]
  */
const updateCartService = async ({ userId, shop_order_ids }) => {
  const { productId, quantity, old_quantity } =
    shop_order_ids[0]?.item_products[0];
  // check product
  console.log("id", productId);
  const foundProduct = await getProductById({ productId });
  if (!foundProduct) throw new NotFoundError("Product not found");
  if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
    throw new NotFoundError("Product does not exists");
  // check cart
  if (quantity === 0) {
    await deleteUserCartService({ userId, productId });
  }
  return await updateUserCartQuantity({
    userId,
    product: {
      productId,
      quantity: quantity - old_quantity,
    },
  });
};

const deleteUserCartService = async ({ userId, productId }) => {
  const deleted = await Cart.updateOne(
    {
      cart_userId: userId,
      cart_state: "active",
    },
    {
      $pull: {
        cart_products: { productId },
      },
    }
  );
  return deleted;
};

const getListUserCartService = async ({ userId }) => {
  return await Cart.findOne({
    cart_userId: userId,
  }).lean();
};

module.exports = {
  addToCartService,
  updateCartService,
  deleteUserCartService,
  getListUserCartService,
};
