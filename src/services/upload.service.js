"use strict";
const cloudinary = require("../configs/cloudinary.config");
const uploadImageFromUrl = async ({ url, folderName, shopId, fileName }) => {
  try {
    const result = await cloudinary.uploader.upload(url, {
      public_id: fileName,
      folder: `${folderName}/${shopId}`,
    });
    return {
      image_url: result.secure_url,
      shopId: shopId,
      thumb_url: await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: "jpg",
      }),
    };
  } catch (error) {
    console.log("Error upload", error);
  }
};

const uploadImageFromLocal = async ({ path, folderName, shopId }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: "thumb",
      folder: `${folderName}/${shopId}`,
    });
    return {
      image_url: result.secure_url,
      shopId: shopId,
      thumb_url: await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: "jpg",
      }),
    };
  } catch (error) {
    console.log("Error upload", error);
  }
};

const uploadImageFromLocalFiles = async ({ files, folderName, shopId }) => {
  try {
    if (!files.length) {
      return;
    }
    const uploadedUrls = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName,
      });
      uploadedUrls.push({
        image_url: result.secure_url,
        shopId: shopId,
        thumb_url: await cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: "jpg",
        }),
      });
    }
    return uploadedUrls;
  } catch (error) {
    console.error("Error uploading images::", error);
  }
};
module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalFiles,
};
