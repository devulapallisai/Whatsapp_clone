const jwt = require("jsonwebtoken");
const asynchandler = require("express-async-handler");
const User = require("../models/userModal");

// Below will check the json web token from frontend is valid or not then decodes it to one user userId as we are using userId while encoding to get that json web token

const authorization = asynchandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decode = jwt.verify(token, process.env.Secretkey);

      // Here we are passing user after getting decoded userId and passing User details like pic,name,email but not password for chat apis and etc

      req.user = await User.findById(decode.userId).select("-password");

      next();
    } catch (err) {
      console.log(err);

      return res.status(401).json({
        error: "Not authorized, token failed",
      });
    }
  }
  if (!token) {
    return res.status(401).json({
      error: "Not authorized, no token",
    });
  }
});

module.exports = authorization;
