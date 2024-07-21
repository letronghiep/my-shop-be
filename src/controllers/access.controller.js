"use strict";
const { BadRequestError } = require("../core/error.response");
const { CREATED, SuccessResponse, OK } = require("../core/success.response");
const {
  signUpService,
  loginService,
  logoutService,
  handleRefreshTokenService,
} = require("../services/access.service");
const signUp = async (req, res, next) => {
  const data = await signUpService(req.body);
  const { tokens } = data;
  // set cookies
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  new CREATED({
    message: "User created successfully",
    metadata: data,
  }).send(res);
};
const login = async (req, res, next) => {
  const data = await loginService(req.body);
  const { tokens } = data;
  // set cookies
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  new OK({
    message: "User login successfully",
    metadata: data,
  }).send(res);
};

const logout = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new BadRequestError('Người dùng không tồn tại')
  }
  // set cookies
  res.cookie("refreshToken", "none", {
    httpOnly: true,
  });
  new SuccessResponse({
    message: "User logged out successfully",
    metadata: await logoutService(req.keyStore),
  }).send(res);
};
const handleRefreshToken = async (req, res, next) => {
  new SuccessResponse({
    message: "User logged out successfully",
    metadata: await handleRefreshTokenService({
      user: req.user,
      keyStore: req.keyStore,
    }),
  }).send(res);
};

module.exports = {
  signUp,
  login,
  logout,
  handleRefreshToken,
};
