"use strict";

// library
const bcrypt = require("bcrypt");

const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const KeyStore = require("../models/keyToken.model");
const generateKey = require("../helpers/generateKey");
const { createKeyToken, removeKeyById } = require("./keyToken.service");
const { getInfoData, randomUserId } = require("../utils");
const { createTokenPair } = require("../auth/authUtil");

const signUpService = async ({ usr_name, usr_password, usr_full_name }) => {
  try {
    const holderUser = await User.findOne({ usr_name }).lean();
    console.log(holderUser);
    if (holderUser) {
      throw new BadRequestError("Tên người dùng đã tồn tại");
    }

    const passwordHash = await bcrypt.hash(usr_password, 10);
    const role = await Role.findOne({
      rol_name: "user",
      rol_status: "active",
    });
    const newUser = await User.create({
      usr_id: randomUserId(),
      usr_name,
      usr_password: passwordHash,
      usr_full_name,
      usr_role: role._id,
    });
    if (newUser) {
      const { publicKey, privateKey } = await generateKey();
      const keyStore = await createKeyToken({
        userId: newUser._id,
        privateKey,
        publicKey,
      });
      if (!keyStore) throw new BadRequestError("Xảy ra lỗi khi tạo khóa");
      const tokens = await createTokenPair(
        { userId: newUser._id, usr_full_name },
        publicKey,
        privateKey
      );
      return {
        tokens,
        user: getInfoData({
          field: ["usr_id", "usr_name", "usr_full_name"],
          object: newUser,
        }),
      };
    }
  } catch (error) {
    throw error;
  }
};
const loginService = async ({ usr_name, usr_password }) => {
  /**
   * check exists user
   * check username
   * check valid password
   * create accessToken and refreshToken
   */
  try {
    console.log(usr_name);
    const foundUser = await User.findOne({
      usr_name,
      usr_status: "active",
    }).lean();
    if (!foundUser) throw new AuthFailureError("Tài khoản không tồn tại");
    // check valid password
    console.log("foundUser::", foundUser);
    console.log("found::", foundUser.usr_password);
    const isMatch = await bcrypt.compare(usr_password, foundUser.usr_password);
    if (!isMatch) throw new AuthFailureError("Mật khẩu không đúng");
    // create token
    const { privateKey, publicKey } = generateKey();
    const { _id: userId } = foundUser;
    const tokens = await createTokenPair(
      { userId, usr_name },
      publicKey,
      privateKey
    );
    // generate token
    const data = await createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      user: getInfoData({
        field: ["__v", "createdAt", "updatedAt"],
        object: foundUser,
      }),
      tokens,
    };
  } catch (error) {
    throw error;
  }
};
// logout
const logoutService = async (keyStore) => {
  try {
    const delKey = await removeKeyById(keyStore._id);
    return delKey;
  } catch (error) {
    throw error;
  }
};
const handleRefreshTokenService = async ({ keyStore, user }) => {
  const refreshToken = req.cookies.refreshToken;
  const { userId, usr_name } = user;
  if (keyStore.refreshTokensUsed.includes(refreshToken))
    throw new ForbiddenError("Có lỗi xảy ra. Vui lòng đăng nhập lại!");
  if (keyStore.refreshToken !== refreshToken)
    throw new AuthFailureError("Tài khoản chưa được đăng ký");
  const foundUser = User.findOne({
    usr_name: usr_name,
    usr_id: userId,
  });
  if (!foundUser) throw new AuthFailureError("Người dùng không tồn tại");
  // check tokens is used
  const tokens = createTokenPair(
    {
      userId,
      usr_name,
    },
    keyStore.publicKey,
    keyStore.privateKey
  );
  // Update tokens;
  await KeyStore.updateOne({
    $set: {
      refreshToken: tokens.refreshToken,
    },
    $addToSet: {
      refreshTokensUsed: refreshToken,
    },
  });
  return {
    user,
    tokens,
  };
};

module.exports = {
  signUpService,
  loginService,
  logoutService,
  handleRefreshTokenService,
};
