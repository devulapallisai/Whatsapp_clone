const jwt = require("jsonwebtoken");
const asynchandler = require("express-async-handler");
const User = require("../models/userModal");

const authorization = asynchandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decode = jwt.verify(token, process.env.Secretkey);

      req.user = await User.findById(decode.userId).select("-password");

      next();
    } catch (err) {
      console.log(err);

      res.status(401).json({
        error: "Not authorized, token failed",
      });
    }
  }
  if (!token) {
    res.status(401).json({
      error: "Not authorized, no token",
    });
  }
});

module.exports = authorization;
