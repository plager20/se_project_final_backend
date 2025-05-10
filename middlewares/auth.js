const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized");

const authorize = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Unauthorized"));
  }

  const token = authorization.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new UnauthorizedError("Unauthorized"));
  }
};

module.exports = { authorize };
