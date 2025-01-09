const { CACHE_ADMIN } = require("../../configs/constant");
const User = require("../user.model");
// const {}
const _ = require("lodash");
const { getCacheIO, setCacheIOExpiration } = require("./cache.repo");
const getListUser = async ({ limit, sort, page, filter }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  return await User.find(filter)
    .populate("usr_role", "rol_name rol_slug")
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .lean();
};
const getDetailUser = async ({ user_id }) => {
  const foundUser = await User.findOne({
    _id: user_id,
  });
  return _.omit(foundUser, ["__v", "createdAt", "updatedAt"]);
};
const findOneUser = async (filter) => {
  console.log(filter);
  return await User.findOne(filter);
};
const getAdmin = async () => {
  const cacheAdmin = `${CACHE_ADMIN.ADMIN}`;
  let idAdmin = await getCacheIO({ key: cacheAdmin });
  if (idAdmin) {
    return JSON.parse(idAdmin);
  } else {
    const admin = await User.findOne({ usr_id: 0 });
    if (admin){
      await setCacheIOExpiration({
        key: cacheAdmin,
        value: JSON.stringify(admin._id),
        expirationInSecond: 3600,
      });
    return admin._id;}
    else return null;
  }
};
module.exports = {
  getListUser,
  findOneUser,
  getDetailUser,
  getAdmin,
};
