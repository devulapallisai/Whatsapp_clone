const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const asynchandler = require("express-async-handler");
const User = require("../models/userModal");
const authorization = require("../middleware/authorization");

// The below is the url for signup to create new account

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
        // console.log(err);
        return res.status(400).json({
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

// The below is the endpoint to send all users existing in whatsapp clone (useful for searching and creating chat)

router.get(
  "/",
  authorization,
  asynchandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    // console.log(req.user._id);
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

    res.send(users);
  })
);

// The below is the end point for logging into whatsapp clone and chatting

router.post(
  "/login",
  asynchandler(async (req, res) => {
    const { email, password } = req.body;
    try {
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
          mode: "Danger",
        });
      }
    } catch (err) {
      return res.status(404).json({
        error: "User not found. Try signing up",
        mode: "Warning",
      });
    }
  })
);

module.exports = router;
