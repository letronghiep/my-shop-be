const User = require("../user.model");
// const {}
const _ = require("lodash");
const getListUser = async ({ limit, sort, page, filter }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  return await User.find(filter)
    .populate("usr_role", 'rol_name rol_slug')
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
module.exports = {
  getListUser,
  getDetailUser,
};
