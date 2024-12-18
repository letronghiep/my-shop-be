"use strict";
const { SuccessResponse } = require("../core/success.response");
const { uploadImageFromUrl } = require("../services/upload.service");

const uploadFile = async (req, res, next) => {
  new SuccessResponse({
    message: "File uploaded successfully",
    metadata: await uploadImageFromUrl({
      url: req.body,
      filename: req.file.filename,
      shopId: req.user.userId,
      folderName: "products",
    }),
  }).send(res);
};
module.exports = {
  uploadFile,
};
