const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/constants");
const UnauthorizedError = require("../errors/unauthorized");

function auth(req, res, next) {
  const { authorization } = req.headers;
  // if condition to make sure that 'authorization' starts with "Bearer ". If not, throw error

  if (!authorization || !authorization.startsWith("Bearer ")) {
    // return res.status(UNAUTHORIZED).send({ message: "Authorization Required" });
    return next(new UnauthorizedError("Authourization required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // throw error

    // return res.status(UNAUTHORIZED).send({ message: "Authorization Required" });
    return next(new UnauthorizedError(err));
  }

  req.user = payload;
  console.log(req.user);
  return next();
}

module.exports = auth;
