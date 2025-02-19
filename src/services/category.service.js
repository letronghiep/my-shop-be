"use strict";
const Category = require("../models/category.model");
const { randomCategoryId } = require("../utils/index");
const { NotFoundError } = require("../core/error.response");
const createCategoryService = async ({
  category_id = randomCategoryId(),
  category_name,
  category_thumb,
  category_parentId = null,
}) => {
  const category = new Category({
    category_id,
    category_name,
    category_thumb,
    category_parentId,
  });
  if (category_parentId) {
    const parentCategory = await Category.findOne({
      category_id: category_parentId,
    }).lean();
    if (!parentCategory) {
      throw new Error("Không tìm thấy danh mục");
    }
    // rightValue = parentCategory.category_right;
    // const children = parentCategory.children
    await Category.findOneAndUpdate(
      {
        category_id: category_parentId,
      },
      {
        $push: {
          children: category,
        },
        $set: {
          has_children: true,
        },
      },
      {
        // new: true,
        upsert: true,
      }
    );
    // await Category.updateMany(
    //   {
    //     category_right: { $gte: rightValue },
    //   },
    //   {
    //     $inc: { category_right: 2 },
    //   }
    // );
    // await Category.updateMany(
    //   {
    //     category_left: { $gt: rightValue },
    //   },
    //   {
    //     $inc: { category_left: 2 },
    //   }
    // );
  } else {
    //   const maxRightValue = await Category.findOne(
    //     {},
    //     {},
    //     {
    //       sort: { category_right: -1 },
    //     }
    //   );
    //   if (maxRightValue) {
    //     rightValue = maxRightValue.category_right + 1;
    //   } else {
    //     rightValue = 1;
    //   }
    await category.save();
  }
  // category.category_left = rightValue;
  // category.category_right = rightValue + 1;
  return category;
};

// get category by parent id
const getCategoryByParentIdService = async ({
  category_parentId = null,
  limit = 50,
  offset = 0,
}) => {
  // if (category_parentId) {
  //   const parent = await Category.findById(category_parentId);
  //   if (!parent) throw new NotFoundError("Không tìm thấy danh mục");
  //   const categories = await Category.find({
  //     category_left: { $gt: parent.category_left },
  //     category_right: { $lte: parent.category_right },
  //   })
  //     .select({
  //       category_left: 1,
  //       category_right: 1,
  //       category_name: 1,
  //       category_thumb: 1,
  //     })
  //     .sort({
  //       category_left: 1,
  //     });
  //   return categories;
  // }
  const categories = await Category.find({})
    .populate(["children"])
    // .select({
    //   category_left: 1,
    //   category_right: 1,
    //   category_name: 1,
    //   category_thumb: 1,
    //   category_id: 1,
    //   category_parentId: 1,
    // })
    .sort({
      createdAt: 1,
    });
  return categories;
};
// delete category

const deleteCategoryService = async ({ category_id }) => {
  const category = await Category.findById(category_id);
  if (!category) throw new NotFoundError("Danh mục không tồn tại");
  // xac dinh thuoc tinh left và right
  const leftValue = category.category_left;
  const rightValue = category.category_right;
  // tinh width:
  const width = rightValue - leftValue + 1;
  // xoa tat ca cac category con
  await Category.deleteMany({
    category_left: { $gte: leftValue, $lte: rightValue },
  });
  // cap nhat lai gia tri left va right
  await Category.updateMany(
    {
      category_left: { $gt: rightValue },
    },
    {
      $inc: {
        category_left: -width,
      },
    }
  );
  await Category.updateMany(
    {
      category_right: { $gt: rightValue },
    },
    {
      $inc: {
        category_right: -width,
      },
    }
  );
  return true;
};
// getCategoryById
const getCategoryByIdService = async ({ category_id }) => {
  const category = await Category.findOne({
    _id: category_id,
  });
  return category;
};
module.exports = {
  createCategoryService,
  getCategoryByParentIdService,
  deleteCategoryService,
  getCategoryByIdService,
};
