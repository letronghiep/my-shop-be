const _ = require("lodash");
const { Types } = require("mongoose");

const getInfoData = ({ field = [], object = {} }) => {
  return _.omit(object, field);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};
const convertToObjMongo = (id) => new Types.ObjectId(id);
const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};
const randomUserId = () => {
  return Math.floor(Math.random() * 89999 + 10000);
};
const randomCategoryId = () => {
  return Math.floor(Math.random() * 89999 + 10000);
};
const randomProductId = () => {
  return Math.floor(Math.random() * 899999 + 100000);
};
module.exports = {
  getInfoData,
  getSelectData,
  convertToObjMongo,
  getUnSelectData,
  randomUserId,
  randomCategoryId,
  randomProductId,
};
