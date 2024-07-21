"use strict";
const { getSelectData } = require("../utils/index");
const paginate = async ({
  model,
  filter,
  page,
  limit,
  select,
  sort,
  populate,
}) => {
  try {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { createdAt: -1 } : { createdAt: 1 };
    const totalRow = await model.countDocuments(filter);
    const totalPage = Math.ceil(totalRow / limit);
    const data = await model
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .populate(populate)
      .exec();
    return {
      limit,
      currentPage: page,
      totalRow,
      totalPage,
      data,
    };
  } catch (error) {
    console.log("Xảy ra lỗi trong quá trình phân trang::", error);
  }
};

// search
// const search = async({}) => {

// }

module.exports = {
  paginate,
};
