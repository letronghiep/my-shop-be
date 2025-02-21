"use strict";

const { CACHE_ORDER } = require("../../configs/constant");
const { getCacheIO, setCacheIOExpiration } = require("./cache.repo");
const Order = require("../order.model");
const { paginate } = require("../../helpers/paginate");
const { Types } = require("mongoose");
// const getOrderByUserList = async ({ page, limit, filter, sort }) => {
//   try {
//     const orderKeyCache = `${CACHE_ORDER["ORDER_LIST"]}:${page}:${limit}`;
//     let orderCache = await getCacheIO({ key: orderKeyCache });

//     if (orderCache) {
//       return { ...JSON.parse(orderCache), toLoad: "cache" };
//     } else {
//       orderCache = await paginate({
//         model: Order,
//         filter,
//         page,
//         limit,
//         sort,
//       });
//       const valueCache = orderCache ? orderCache : null;
//       const getCountOrder = async (orderStatus) => {
//         return await Order.countDocuments({
//           order_status: orderStatus,
//         });
//       };

//       // "pending", "confirmed", "shipped", "cancelled", "delivered"
//       const count = {
//         pending: await getCountOrder("pending"),
//         canceled: await getCountOrder("canceled"),
//         delivered: await getCountOrder("delivered"),
//         confirmed: await getCountOrder("confirmed"),
//         shipped: await getCountOrder("shipped"),
//       };
//       const getTotalProduct = async () => {
//         const { order_userId } = filter;
//         const total = await Order.aggregate([
//           { $match: { order_userId: new Types.ObjectId(order_userId) } },
//           { $unwind: "$order_products" },
//           { $unwind: "$order_products.item_products" },
//           {
//             $group: {
//               _id: "$order_id",
//               total_products: {
//                 $sum: "$order_products.item_products.quantity",
//               },
//             },
//           },
//         ]);
//         return total;
//       };
//       const total_products = await getTotalProduct();
//       const items = valueCache.data.map((item) => {
//         const total_product = total_products.find(
//           (totalItem) =>
//             totalItem._id === item.order_id && totalItem.total_products
//         );
//         return {
//           ...item,
//           total_product: total_product ? total_product.total_products : 0,
//         };
//       });
//      const resultValue = { ...valueCache, data: items };
//       const result = {
//         ...resultValue,
//         ...count,
//         total_products,
//       };
//       await setCacheIOExpiration({
//         key: orderKeyCache,
//         value: JSON.stringify(result),
//         expirationInSecond: 60,
//       });
//       return {
//         ...orderCache,
//         ...count,
//         total_products,
//         toLoad: "db",
//       };
//     }
//   } catch (error) {
//     throw error;
//   }
// };
const getOrderByUserList = async ({ page, limit, filter, sort }) => {
  try {
    console.log(filter);
    // const { order_status } = filter;
    // const orderKeyCache = `${CACHE_ORDER["ORDER_LIST"]}:${page}:${limit}:${order_status}`;
    // const cachedData = await getCacheIO({ key: orderKeyCache });

    // if (cachedData) {
    //   return { ...JSON.parse(cachedData), toLoad: "cache" };
    // }

    // Fetch paginated order data
    const orderCache = await paginate({
      model: Order,
      filter,
      page,
      limit,
      sort,
    });

    if (!orderCache) throw new Error("No orders found");

    const { order_userId } = filter;

    // Parallel fetching of counts and total products
    const [counts, totalProducts] = await Promise.all([
      // Fetch order counts by status
      Promise.all(
        ["pending", "canceled", "delivered", "confirmed", "shipped"].map(
          async (status) => ({
            [status]: await Order.countDocuments({ order_status: status }),
          })
        )
      ).then((res) => Object.assign({}, ...res)),

      // Fetch total products
      Order.aggregate([
        { $match: { order_userId: new Types.ObjectId(order_userId) } },
        { $unwind: "$order_products" },
        { $unwind: "$order_products.item_products" },
        {
          $group: {
            _id: "$order_id",
            total_products: { $sum: "$order_products.item_products.quantity" },
          },
        },
      ]),
    ]);

    // Map total products to orders
    const items = orderCache.data.map((item) => {
      const totalProduct = totalProducts.find(
        (totalItem) => totalItem._id === item.order_id
      );
      return {
        ...item,
        total_product: totalProduct ? totalProduct.total_products : 0,
      };
    });

    // Construct result
    const result = {
      ...orderCache,
      data: items,
      ...counts,
    };

    // // Cache the result
    // await setCacheIOExpiration({
    //   key: orderKeyCache,
    //   value: JSON.stringify(result),
    //   expirationInSecond: 60,
    // });

    return await result;
  } catch (error) {
    console.error("Error in getOrderByUserList:", error);
    throw error;
  }
};

module.exports = {
  getOrderByUserList,
};
