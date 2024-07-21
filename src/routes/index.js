"use strict";
const express = require("express");
const { permission, apiKey } = require("../auth/checkAuth");
const router = express.Router();
router.use(apiKey);
router.use(permission("0000"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/category", require("./category"));
router.use("/v1/api/rbac", require("./rbac"));
router.use("/v1/api/auth", require("./access"));
router.use("/v1/api/user", require("./user"));
module.exports = router;