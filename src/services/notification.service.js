"use strict";
const Notification = require("../models/notification.model");
const pushNotifyToSystem = async ({
  type = "SHOP-001",
  receiverId,
  senderId,
  notify_content,
  options = {},
}) => {
  // let notify_content;
  // switch (type) {
  //   case "SHOP-001":
  //     notify_content = `@@@ vừa thêm một sản phẩm mới @@@@`;
  //     break;
  //   case "PROMOTION-001":
  //     notify_content = `@@@ vừa thêm một voucher mới @@@@`;
  //     break;
  //   default:
  //     notify_content = `@@@ Loại thông báo không xác định @@@@`;
  // }
  const newNotify = await Notification.create({
    notify_type: type,
    notify_content: notify_content,
    notify_receiverId: receiverId,
    notify_senderId: senderId,
    notify_options: options,
  });
  return newNotify;
};
const listNotifyByUserService = async ({
  userId,
  type = "ALL",
  isRead = 0,
}) => {
  const match = { notify_receiverId: userId };
  if (type !== "ALL") {
    match["notify_type"] = type;
  }

  return await Notification.aggregate([
    {
      $match: match,
    },
    {
      $project: {
        notify_type: 1,
        notify_senderId: 1,
        notify_receiverId: 1,
        notify_content: 1,
        notify_isRead: 1,
        notify_createdAt: 1,
        notify_options: 1,
      },
    },
  ]);
};
module.exports = {
  pushNotifyToSystem,
  listNotifyByUserService,
};
