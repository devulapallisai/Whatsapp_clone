const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const asynchandler = require("express-async-handler");
const User = require("../models/userModal");

router.post(
  "/signup",
  asynchandler((req, res) => {
    const { name, email, password, pic } = req.body;
    const user = new User({
      name: name,
      email: email,
      password: bcrypt.hashSync(password, 10),
      pic: pic,
    });
    user.save((err) => {
      if (err) {
        return res.status(404).json({
          error: "Email already in use",
        });
      }
      const Token = jwt.sign({ userId: user._id }, process.env.Secretkey, {
        expiresIn: "1d",
      });
      return res.status(200).json({
        _id: user._id,
        email: user.email,
        pic: user.pic,
        name: user.name,
        token: Token,
      });
    });
  })
);

router.post(
  "/login",
  asynchandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    const Token = jwt.sign({ userId: user._id }, process.env.Secretkey, {
      expiresIn: "1d",
    });
    if (user && bcrypt.compareSync(password, user.password)) {
      return res.status(200).json({
        _id: user._id,
        email: user.email,
        pic: user.pic,
        name: user.name,
        token: Token,
      });
    } else {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }
  })
);

module.exports = router;
