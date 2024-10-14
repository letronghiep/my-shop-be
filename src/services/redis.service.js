"use strict";

const { promisify } = require("util");

const { getRedis } = require("../db/init.redis");
const { reservationInventory } = require("../models/repo/inventory.repo");

const {
  instanceConnect: redisClient
} = getRedis()


const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)
const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2024_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; // 3s tam lock
  for (let i = 0; i < retryTimes; i++) {
    // tao mot key, ai nam key duoc thanh toan
    const result = await setnxAsync(key, expireTime);
    if (result === 1) {

      // thao tac voi inventory
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      console.log("A", isReservation)
      if (isReservation.modifiedCount) {

        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      console.log("aaa")
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};
const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
