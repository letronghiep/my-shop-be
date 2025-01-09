"use strict";

const { CACHE_ORDER } = require("../../configs/constant");
const { getCacheIO } = require("./cache.repo");
const Order = require('../order.model')
const getOrderByUserList = async ({ page, limit, filter, sort }) => {
  try {
    const orderKeyCache = `${CACHE_ORDER["ORDER_LIST"]}:${page}:${limit}`;
    let orderCache = await getCacheIO({ key: orderKeyCache });

    if (orderCache) {
      return { ...JSON.parse(orderCache), toLoad: "cache" };
    } else {
      orderCache = await paginate({
        model: Order,
        filter,
        page,
        limit,
        sort,
      });
      const valueCache = orderCache ? orderCache : null;
      await setCacheIOExpiration({
        key: orderKeyCache,
        value: JSON.stringify(valueCache),
        expirationInSecond: 60,
      });
      return {
        ...orderCache,
        toLoad: "db",
      };
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOrderByUserList,
};
