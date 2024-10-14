"use strict";
const { SuccessResponse } = require("../core/success.response");
const { listNotifyByUserService } = require("../services/notification.service");
const listNotifyByUser = async (req, res, next) => {
  new SuccessResponse({
    message: "list listNotifyByUser",
    metadata: await listNotifyByUserService(req.query),
  }).send(res);
};
module.exports = {
    listNotifyByUser,
}
