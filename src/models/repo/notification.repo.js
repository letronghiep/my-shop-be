"use strict";
const generateNotification = (key, data) => {
  switch (key) {
    case "shipping.created":
      return `Địa chỉ ${data.shipping_id} đã được ${data.user_id} tạo`;
    case "shipping.updated":
        if (data.is_delivery_address)
            return `Địa chỉ ${data.shipping_id} đã đươc ${data.user_id} thay đổi thành địa chỉ giao hàng`;
        else if (data.is_return_address)
            return `Địa chỉ ${data.shipping_id} đã được ${data.user_id} thay đổi thành địa chỉ trả hàng`;
        else
            return `Địa chỉ ${data.shipping_id} đã được người dùng ${data.user_id} cập nhật`;
    case "shipping.deleted":
      return `Địa chỉ ${data.shipping_id} đã được ${data.user_id} xóa `;
    default:
      return "";
  }
};

module.exports = {
  generateNotification,
};
