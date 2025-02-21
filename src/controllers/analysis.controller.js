"use strict";

const { SuccessResponse } = require("../core/success.response");
const { getAnalysisDataService } = require("../services/analysis.service");

const getAnalysisData = async (req, res, next) => {
  new SuccessResponse({
    message: "get analysis data",
    metadata: await getAnalysisDataService({
      userId: req.user.userId,
    }),
  }).send(res);
};

module.exports = {
  getAnalysisData,
};
