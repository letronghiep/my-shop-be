"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const {
  createCommentService,
  getCommentByParentIdService,
  deleteCommentService,
} = require("../services/comment.service");

const createComment = async (req, res, next) => {
  new CREATED({
    message: "message was created",
    metadata: await createCommentService({
      userId: req.user.userId,
      ...req.body,
    }),
  }).send(res);
};

const getCommentByParentId = async (req, res, next) => {
  new SuccessResponse({
    message: "comments",
    metadata: await getCommentByParentIdService(req.query),
  }).send(res);
};

const deleteComment = async (req, res, next) => {
  new SuccessResponse({
    message: "comment deleted",
    metadata: await deleteCommentService(req.body),
  }).send(res);
};
module.exports = {
  createComment,
  getCommentByParentId,
  deleteComment,
};
