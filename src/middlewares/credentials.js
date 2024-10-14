
const credentials = (req, res, next) => {
  // const origin = req.headers.origin;
  // if (allowedOrigins.includes(origin))
  res.header("Access-Control-Allow-Origin", true);
  // res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
};
module.exports = credentials;