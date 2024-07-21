"use strict";
const rbac = require("./role.middleware");
const User = require("../models/user.model");
const { getListRole } = require("../services/rbac.service");
const { AuthFailureError } = require("../core/error.response");
const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      rbac.setGrants(
        await getListRole({
          userId: 0,
        })
      );

      console.log(rbac.getGrants());
      // console.log(req.user)
      const userId = req.user.userId;
      const user = await User.findById(userId).populate("usr_role").lean();
      console.log("user:->:", user);
      const rol_name = user.usr_role.rol_name;
      const permission = rbac.can(rol_name)[action](resource);
      console.log("permission:->:", permission);
      if (!permission.granted)
        throw new AuthFailureError("Bạn không có quyền truy cập hệ thống");
      next();
    } catch (error) {
      next(error);
    }
  };
};
module.exports = {
  grantAccess,
};
