"use strict";
const Order = require("../models/order.model");
const { BadRequestError } = require("../core/error.response");
const {} = require("../core/success.response");
const { findCartById } = require("../models/repo/cart.repo");
const { checkProductByServer } = require("../models/repo/product.repo");
const { getDiscountAmount } = require("../controllers/discount.controller");
const { acquireLock, releaseLock } = require("../services/redis.service");
const { deleteUserCartService } = require("./cart.service");
const { producer } = require("./rabbitMQ.service");
/* 
    {
        cartId,
        userId,
        shop_order_ids: [
            {
                shopId,
                shop_discount: [],
                item_products: [
                    {
                    price,
                    quantity,
                    productId
                    }
                ]
            },
            {
                shopId,
                shop_discount: [
                    {
                        shopId,
                        discountId,
                        codeId
                    }
                ],
                item_products: [
                    {
                    price,
                    quantity,
                    productId
                    }
                ]
            }
        ]
    }

*/
// const io = getIO();
const checkoutReviewService = async ({
  cartId,
  userId,
  shop_order_ids = [],
}) => {
  const foundCart = await findCartById({ cartId });
  if (!foundCart) throw new BadRequestError("Cart not exists");
  if (!foundCart.cart_products.length) {
    throw new BadRequestError("Cart is empty");
  }
  const checkout_order = {
    totalPrice: 0, // tong tien hang
    feeShip: 0, // phi van chuyen
    totalDiscount: 0, // tong giam gia
    totalCheckout: 0, // tong thanh toan
  };
  const shop_order_ids_new = [];
  // tinh tong tien bill
  for (let i = 0; i < shop_order_ids.length; i++) {
    const {
      shopId,
      shop_discounts = [],
      item_products = [],
    } = shop_order_ids[i];
    // check product server
    const checkProductServer = await checkProductByServer(item_products);
    if (!checkProductServer[0]) throw new BadRequestError("order wrong!!!");
    // tong tien don hang
    const checkoutPrice = checkProductServer.reduce((acc, product) => {
      return acc + product.quantity * product.price;
    }, 0);
    // tong tien truoc xu li
    checkout_order.totalPrice = +checkoutPrice;
    const itemCheckout = {
      shopId,
      shop_discounts,
      priceRaw: checkoutPrice,
      priceApplyDiscount: checkoutPrice,
      item_products: checkProductServer,
    };
    if (shop_discounts.length > 0) {
      const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
        codeId: shop_discounts[0].codeId,
        userId: userId,
        shopId,
        products: checkProductServer,
      });
      // tong discount giam gia
      checkout_order.totalDiscount += discount;
      if (discount > 0) {
        itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        // tong thanh toan cuoi cung
        checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      }
    }
    shop_order_ids_new.push(itemCheckout);
    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }
};
// order
const orderByUserService = async ({
  shop_order_ids,
  cartId,
  userId,
  user_address,
  user_payment,
}) => {
  const { shop_order_ids_new, checkout_order } = await checkoutReviewService({
    cartId,
    userId,
    shop_order_ids,
  });
  // check lai mot lan nua xem vuot ton kho hay khong
  // get new array product
  const products = await shop_order_ids_new.flatMap((order) => {
    return order.item_products;
  });
  const acquireProduct = [];
  for (let i = 0; i < products.length; i++) {
    const { productId, quantity } = products[i];
    const keyLock = await acquireLock(productId, quantity, cartId);
    acquireProduct.push(keyLock ? true : false);
    if (keyLock) {
      await releaseLock(keyLock);
    }
  }
  // check neu co mot san pham het hang trong kho
  if (acquireProduct.includes(false)) {
    throw new BadRequestError(
      "Mot so san pham da duoc cap nhat, vui long quay lai gio hang..."
    );
  }
  const newOrder = await Order.create({
    order_userId: userId,
    order_checkout: checkout_order,
    order_shipping: user_address,
    order_payment: user_payment,
    order_products: shop_order_ids_new,
  });
  if (newOrder) {
    // remove product in my cart
    await deleteUserCartService({
      userId,
      productId: shop_order_ids_new.flatMap((order) =>
        order.item_products.map((product) => product.productId)
      ),
    });
    await producer(JSON.stringify(newOrder), "orderQueue");
    // io.emit("order-requirement", newOrder);
  }
  return newOrder;
};
/*
 Query order
 */
const getOrderByUserService = async ({ userId, limit = 20, skip = 0 }) => {
  const query = {
    order_userId: userId,
  };
  return await Order.find(query).skip(skip).limit(limit);
};
const getDetailOrderService = async ({ userId, orderId }) => {
  return await Order.findOne({
    order_userId: userId,
    _id: orderId,
  });
};

const cancelOrderService = async ({ orderId, userId }) => {
  const query = {
      order_userId: userId,
      _id: orderId,
    },
    updateSet = {
      order_status: "canceled",
    };
  const { modifiedCount } = await Order.updateOne(query, updateSet);
  return modifiedCount;
};
const updateStatusOrderService = async ({ order_status, userId, orderId }) => {
  const query = {
      order_userId: userId,
      _id: orderId,
    },
    updateSet = {
      order_status: order_status,
    };
  const { modifiedCount } = await Order.updateOne(query, updateSet);
  return modifiedCount;
};
module.exports = {
  checkoutReviewService,
  orderByUserService,
  cancelOrderService,
  updateStatusOrderService,
  getOrderByUserService,
  getDetailOrderService,
};
