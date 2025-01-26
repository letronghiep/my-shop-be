"use strict";
const { Types } = require("mongoose");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};
const getWeekRange = (startDate) => {
  const startOfCurrentWeek = new Date(startDate);
  startOfCurrentWeek.setDate(
    startOfCurrentWeek.getDate() - startOfCurrentWeek.getDay()
  );
  const endOfCurrentWeek = new Date(startOfCurrentWeek);
  endOfCurrentWeek.setDate(endOfCurrentWeek.getDate() + 6);
  const startOfPreviousWeek = new Date(startOfCurrentWeek);
  startOfPreviousWeek.setDate(startOfPreviousWeek.getDate() - 7);
  const endOfPreviousWeek = new Date(startOfPreviousWeek);
  endOfPreviousWeek.setDate(endOfPreviousWeek.getDate() + 6);
  return {
    currentWeek: { start: startOfCurrentWeek, end: endOfCurrentWeek },
    previousWeek: { start: startOfPreviousWeek, end: endOfPreviousWeek },
  };
};
const getAnalysisDataService = async ({ userId }) => {
  try {
    const orderDataPromise = Order.aggregate([
      {
        $match: {
          order_userId: new Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: "$order_status",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const weeklyRevenueData = (async () => {
      const today = new Date();
      const { currentWeek, previousWeek } = getWeekRange(today);
      const weekly = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(previousWeek.start),
              $lte: new Date(currentWeek.end),
            },
          },
        },
        {
          $unwind: "$order_products",
        },
        {
          $group: {
            _id: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$createdAt", new Date(previousWeek.start)] },
                    { $lte: ["$createdAt", new Date(previousWeek.end)] },
                  ],
                },
                "previousWeek",
                "currentWeek",
              ],
            },
            // sales: { $sum: "$order_total" }, // Uncomment if needed
            revenue: { $sum: "$order_products.priceApplyDiscount" },
            total_order: { $sum: 1 },
          },
        },
      ]);
      const currentWeekRevenue = weekly.find(
        (item) => item._id === "currentWeek"
      )?.revenue;
      const previousWeekRevenue = weekly.find(
        (item) => item._id === "previousWeek"
      )?.revenue;
      const currentWeekOrder = weekly.find(
        (item) => item._id === "currentWeek"
      )?.total_order;
      const previousWeekOrder = weekly.find(
        (item) => item._id === "previousWeek"
      )?.total_order;
      console.log("1::", previousWeekOrder);
      const difference = currentWeekRevenue - previousWeekRevenue;
      const order_dif = currentWeekOrder - previousWeekOrder;

      const order_per = ((order_dif / previousWeekOrder) * 100).toFixed(2);
      const percentageChange = (
        (difference / previousWeekRevenue) *
        100
      ).toFixed(2);

      const dailySaleData = async () => {
        try {
          const daily = await Order.aggregate([
            {
              $match: {
                createdAt: {
                  $gte: currentWeek.start,
                  $lte: currentWeek.end,
                },
              },
            },
            {
              $unwind: "$order_products", // Tách các phần tử trong order_products
            },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                revenue: { $sum: "$order_products.priceApplyDiscount" },
                order: { $sum: 1 },
              },
            },
            {
              $sort: { _id: 1 }, // Sắp xếp theo ngày (tùy chọn)
            },
          ]);

          // Tạo mảng ngày đầy đủ
          const dateArray = getDatesInRange(currentWeek.start, currentWeek.end);

          // Kết hợp dữ liệu daily với mảng ngày
          return dateArray.map((date) => {
            const foundData = daily.find((item) => item._id === date);
            return {
              date,
              revenue: foundData?.revenue || 0,
              order: foundData?.order || 0,
            };
          });
        } catch (error) {
          console.error("Error fetching daily sales data:", error);
          return [];
        }
      };
      const total_order = await Order.countDocuments({});
      return {
        daily: await dailySaleData(),
        weekly,
        current_week_revenue: currentWeekRevenue,
        previous_week_revenue: previousWeekRevenue,
        current_week_order: currentWeekOrder,
        previous_week_order: previousWeekOrder,
        order_per: parseFloat(order_per),
        order_dif,
        difference,
        percentage_change: parseFloat(percentageChange),
        current_week: { start: currentWeek.start, end: currentWeek.end },
        previous_week: { start: previousWeek.start, end: previousWeek.end },
        total_order,
      };
    })();
    const [orderData, weeklyRevenue] = await Promise.all([
      orderDataPromise,
      weeklyRevenueData,
    ]);
    const resultOrder = orderData.reduce((order, item) => {
      order[item._id] = item.count;
      return order;
    }, {});

    return {
      order: resultOrder,
      revenue_report: weeklyRevenue,
    };
  } catch (error) {
    console.error("Error fetching analysis data:", error);
    throw new Error("Failed to get analysis data");
  }
};

module.exports = {
  getAnalysisDataService,
};
