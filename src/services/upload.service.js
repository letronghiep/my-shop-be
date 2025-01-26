"use strict";
const cloudinary = require("../configs/cloudinary.config");
const { removeFileFromDirectory } = require("../helpers/removeFile");
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
const uploadImageFromLocalFile = async ({ file }) => {
  try {
    if (!file) {
      console.log("Error");
      return;
    }
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'images',
    });
    if (result) {
      const uploadedUrl = {
        image_url: result.secure_url,
        // shopId: shopId,
        thumb_url: await cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: "jpg",
        }),
      };
      const pathName = `./src/uploads`;
      await removeFileFromDirectory(pathName);
      return uploadedUrl;
    } else return null;
  } catch (error) {
    console.error("Error uploading images::", error);
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
  uploadImageFromLocalFile,
  uploadImageFromLocalFiles,
};
