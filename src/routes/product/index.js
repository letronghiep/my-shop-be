"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const {
  createProductByShop,
  createProductByAdmin,
  getAllProduct,
  getAllPublishedProduct,
  getAllDraftProduct,
  publishedProductByShop,
  publishedProductByAdmin,
  draftProductByShop,
  draftProductByAdmin,
  deleteProductByAdmin,
  blockProductByShop,
  blockProductByAdmin,
  deleteProductByShop,
  updateProductByShop,
  getProductById,
  getListProductByShop,
  searchProduct,
} = require("../../controllers/product.controller");
const { authentication } = require("../../middlewares/authentication");
const { grantAccess } = require("../../middlewares/rbac.middleware");
const router = express.Router();
// user

router.get("", asyncHandler(getAllProduct));
router.get("/shop/:product_shop", asyncHandler(getListProductByShop));
router.get("/search", asyncHandler(searchProduct));
router.get("/:product_id", asyncHandler(getProductById));
router.use(authentication);

// shop
router.post(
  "/seller",
  grantAccess("createOwn", "product"),
  asyncHandler(createProductByShop)
);

router.patch(
  "/seller/:product_id",
  grantAccess("updateOwn", "product"),
  asyncHandler(updateProductByShop)
);

router.get(
  "/seller/published",
  grantAccess("readOwn", "product"),
  asyncHandler(getAllPublishedProduct)
);
router.get(
  "/seller/draft",
  grantAccess("readOwn", "product"),
  asyncHandler(getAllDraftProduct)
);
router.post(
  "/seller/published/:product_id",
  grantAccess("updateOwn", "product"),
  asyncHandler(publishedProductByShop)
);
router.post(
  "/seller/draft/:product_id",
  grantAccess("updateOwn", "product"),
  asyncHandler(draftProductByShop)
);
router.post(
  "/seller/block/:product_id",
  grantAccess("updateOwn", "product"),
  asyncHandler(blockProductByShop)
);
router.delete(
  "/seller/:product_id",
  grantAccess("deleteOwn", "product"),
  asyncHandler(deleteProductByShop)
);
// admin
router.post(
  "/admin",
  grantAccess("createAny", "product"),
  asyncHandler(createProductByAdmin)
);
router.post(
  "/admin/published",
  grantAccess("updateAny", "product"),
  asyncHandler(publishedProductByAdmin)
);
router.post(
  "/admin/draft",
  grantAccess("updateAny", "product"),
  asyncHandler(draftProductByAdmin)
);
router.post(
  "/admin/block",
  grantAccess("updateAny", "product"),
  asyncHandler(blockProductByAdmin)
);
router.delete(
  "/admin",
  grantAccess("deleteAny", "product"),
  asyncHandler(deleteProductByAdmin)
);
module.exports = router;
