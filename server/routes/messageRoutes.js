const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const authorization = require("../middleware/authorization");
const Message = require("../models/messageModal");
const Chat = require("../models/chatModal");
const User = require("../models/userModal");
const bcrypt = require("bcrypt");

const router = express.Router();

// add a new message into the chat

router.route("/").post(
  authorization,
  expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res.status(400).send("Invalid data");
    }

    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    try {
      var message = await Message.create(newMessage);
      message = await message.populate("sender", "name pic email");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });

      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

      res.status(200).json(message);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  })
);

// Get all messages of a particular chat after providing that chatID

router.route("/:chatId").get(
  authorization,
  expressAsyncHandler(async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name pic email")
        .populate("chat");
      res.status(200).json(messages);
    } catch (error) {
      res.status(400).send(error);
    }
  })
);

module.exports = router;
