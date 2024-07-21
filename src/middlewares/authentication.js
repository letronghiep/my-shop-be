const { HEADER } = require("../constants");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const {
  BadRequestError,
  NotFoundError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findKeyTokenByUser } = require("../services/keyToken.service");
const { verifyJWT } = require("../auth/authUtil");

const authentication = async (req, res, next) => {
  try {
    const token = await req.headers[HEADER.AUTHORIZATION];
    if (!token || !token.startsWith("Bearer "))
      throw new AuthFailureError("Kiểm tra lại thông tin");
    const userId = await req.headers[HEADER.CLIENT_ID];
    // const token = await req.headers[HEADER.AUTHORIZATION]; // refreshToken
    // if (!token || !token.startssWith("Bearer "))
    //   throw new AuthFailureError("Kiểm tra lại thông tin");
    // const accessToken = token.split("Bearer ")[1];
    // if (!accessToken) throw new AuthFailureError("Không có quyền truy cập");
    // console.log(accessToken);
    // const keyStore = await findKeyTokenByUser({ userId });
    // if (keyStore) {
    //   const { refreshToken, privateKey } = keyStore;
    //   const decodeUser = verifyToken(refreshToken, privateKey);
    //   console.log("decode user::", decodeUser);
    //   if (userId !== decodeUser.userId)
    //     throw new AuthFailureError("Người dùng không hợp lệ");
    //   req.user = decodeUser;
    //   req.keyStore = keyStore;
    //   req.refreshToken = refreshToken;

    const accessToken = token.split("Bearer ")[1];
    const keyStore = await findKeyTokenByUser({ userId });
    if (!keyStore) throw new AuthFailureError("Người dùng không hợp lệ");
    const decodeUser = await jwt.verify(accessToken, keyStore.publicKey);
    console.log("decodeUser::", decodeUser);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Người dùng không hợp lệ");
    req.user = decodeUser;
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    next(error);
  }
};
const checkAdmin = async (req, res, next) => {
  const usr_name = await req.body.usr_name;
  try {
    const foundUser = await User.findOne({
      usr_name,
    })
      .populate("usr_role")
      .lean();
    if (foundUser.usr_role.rol_slug !== "s00001") {
      throw new AuthFailureError("Tài khoản không phải admin");
    }
    return next();
  } catch (error) {
    next(error);
  }
};
const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("usr_role").lean();
    if (user.usr_role.rol_slug !== "s00001") {
      throw new AuthFailureError("Bạn không có quyền quản trị viên");
    }
    return next();
  } catch (error) {
    next(error);
  }
};
const isNotUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("usr_role").lean();
    if (user.usr_role.rol_slug === "s00003") {
      throw new AuthFailureError("Người dùng không có quyền đăng sản phẩm");
    }
    return next();
  } catch (error) {
    next(error);
  }
};
module.exports = {
  authentication,
  checkAdmin,
  isAdmin,
  isNotUser,
};
