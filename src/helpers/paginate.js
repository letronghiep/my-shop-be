"use strict";
const { getSelectData } = require("../utils/index");
const paginate = async ({
  model,
  filter,
  page=1,
  limit = 50,
  select,
  sort,
  populate,
}) => {
  try {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { createdAt: -1 } : { createdAt: 1 };
    const totalRows = await model.countDocuments(filter);
    const totalPages = Math.ceil(totalRows / limit);
    const data = await model
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .populate(populate)
      .lean();
    return {
      limit,
      currentPage: page,
      totalRows,
      totalPages,
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
