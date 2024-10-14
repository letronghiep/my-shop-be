"use strict";
const { NotFoundError } = require("../core/error.response");
const Comment = require("../models/comment.model");
const { getProductById } = require("../models/repo/product.repo");
/**
 * create comment
 * get comment parent
 * delete comment
 *
 */
const createCommentService = async ({
  productId,
  userId,
  content,
  parentCommentId = null,
}) => {
  // create comment
  const comment = new Comment({
    comment_productId: productId,
    comment_userId: userId,
    comment_content: content,
    comment_parentId: parentCommentId,
  });
  let right_value;
  if (parentCommentId) {
    const parentComment = await Comment.findOne({
      _id: parentCommentId,
    });
    if (!parentComment) throw new NotFoundError("Không tìm thấy comment");
    right_value = parentComment.comment_right;
    await Comment.updateMany(
      {
        comment_productId: productId,
        comment_right: { $gte: right_value },
      },
      {
        $inc: { comment_right: 2 },
      }
    );
    await Comment.updateMany(
      {
        comment_productId: productId,
        comment_left: { $gt: right_value },
      },
      {
        $inc: { comment_left: 2 },
      }
    );
  } else {
    const maxRightValue = await Comment.findOne(
      {
        comment_productId: productId,
      },
      "comment_right",
      { sort: { comment_right: -1 } }
    );
    if (maxRightValue) {
      right_value = maxRightValue + 1;
    } else right_value = 1;
  }
  comment.comment_left = right_value;
  comment.comment_right = right_value + 1;
  await comment.save();
  return comment;
};
const getCommentByParentIdService = async ({
  productId,
  commentParentId = null,
  limit = 50,
  offset = 0,
}) => {
  if (commentParentId) {
    const parentComment = await Comment.findById(commentParentId);
    if (!parentComment) throw new NotFoundError("Không tìm thấy comment");
    const comments = await Comment.find({
      comment_productId: productId,
      comment_left: { $gt: parentComment.comment_left },
      comment_right: { $lte: parentComment.comment_right },
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({
        comment_left: 1,
      })
      .limit(limit)
      .skip(offset);
    return comments;
  }
  const comments = await Comment.find({
    comment_productId: productId,
    comment_parentId: commentParentId,
  })
    .select({
      comment_left: 1,
      comment_right: 1,
      comment_content: 1,
      comment_parentId: 1,
    })
    .sort({
      comment_left: 1,
    })
    .limit(limit)
    .skip(offset);
  return comments;
};
// delete comment
const deleteCommentService = async ({ productId, commentId }) => {
  // check exists products
  const foundProduct = await getProductById({
    productId,
  });
  if (!foundProduct) throw new NotFoundError("Sản phẩm không tồn tại");
  const comment = await Comment.findOne({
    _id: commentId,
  });
  if (!comment) throw new NotFoundError("Không tìm thấy comment");
  // xac dinh vi tri left và right
  const leftValue = comment.comment_left;
  const rightValue = comment.comment_right;
  // xac dinh width
  const width = rightValue - leftValue + 1;

  await Comment.deleteMany({
    comment_productId: productId,
    comment_left: { $gte: leftValue, $lte: rightValue },
  });
  // cap nhart lai left right
  await Comment.updateMany(
    {
      comment_productId: productId,
      comment_left: { $gt: rightValue },
    },
    {
      $inc: { comment_left: -width },
    }
  );
  await Comment.updateMany(
    {
      comment_productId: productId,
      comment_right: { $gt: rightValue },
    },
    {
      $inc: { comment_right: -width },
    }
  );
  return true;
};
module.exports = {
  createCommentService,
  getCommentByParentIdService,
  deleteCommentService,
};
