const jwt = require("jsonwebtoken");

function auth(req, res) {
  const { authorization } = req.headers;
  //if condition to make sure that 'authorization' starts with "Bearer ". If not, throw error
  if (authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Authorization Required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    //throw error
    return res.status(401).send({ message: "Authorization Required" });
  }

  req.user = payload;
  next();
}

module.exports = auth;
