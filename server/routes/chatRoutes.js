const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const authorization = require("../middleware/authorization");
const Chat = require("../models/chatModal");
const User = require("../models/userModal");

const router = express.Router();

// Below is endpoint for creating new chat if not created. If created it returns previous chat that is already created

router.route("/").post(
  authorization,
  expressAsyncHandler(async (req, res) => {
    const { chatId } = req.body;

    var chatexists = await Chat.find({
      isGroupchat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: chatId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    chatexists = await User.populate(chatexists, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    if (chatexists.length) {
      res.send(chatexists[0]);
    } else {
      const chat = new Chat({
        chatName: "sender",
        isGroupchat: false,
        users: [req.user._id, chatId],
      });

      chat.save(async (err) => {
        if (err) {
          console.log(err);
          return res.status(400);
        }

        const Fullchat = await Chat.findOne({ _id: chat._id }).populate(
          "users",
          "-password"
        );

        res.status(200).send(Fullchat);
      });
    }
  })
);

// below is end point for returning all chats including group chats that user involved in

router.route("/").get(
  authorization,
  expressAsyncHandler(async (req, res) => {
    try {
      var chats = await Chat.find({
        users: { $elemMatch: { $eq: req.user._id } },
      })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
          });

          res.status(200).send(results);
        });
    } catch (err) {
      return res.status(400);
    }
  })
);

// Below is the end point for creating new group chat

router.route("/group").post(
  authorization,
  expressAsyncHandler(async (req, res) => {
    const { users, name } = req.body;

    var usersgroup = JSON.parse(users);
    if (usersgroup.length < 2) {
      return res.status(400).send("More than 2 people is required for chat");
    }
    usersgroup.push(req.user);
    try {
      const newchat = new Chat({
        chatName: name,
        users: usersgroup,
        isGroupchat: true,
        groupAdmin: req.user,
      });
      newchat.save(async (err) => {
        if (err) {
          res.status(400).send("Failed to create new chat");
        }
        const fullGroupchat = await Chat.findOne({ _id: newchat._id })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupchat);
      });
    } catch (err) {
      return res.status(400).send("Internal error");
    }
  })
);

// Below is the endpoint for renaming the Group name

router.route("/group/rename").put(
  authorization,
  expressAsyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    try {
      const updateGroupname = await Chat.findByIdAndUpdate(
        chatId,
        { chatName },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      if (!updateGroupname) {
        return res.status(400).send("Group not found");
      } else {
        res.status(200).json(updateGroupname);
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send("Internal error");
    }
  })
);

router.route("/group/addTogroup").put(
  authorization,
  expressAsyncHandler(async (req, res) => {
    const { userId, chatId } = req.body;
    try {
      const add = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      if (!add) {
        return res.status(400).send("User cannot be found");
      } else {
        res.status(200).json(add);
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send("Internal error");
    }
  })
);

router.route("/group/remove").put(
  authorization,
  expressAsyncHandler(async (req, res) => {
    const { userId, chatId } = req.body;
    try {
      const remove = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId } },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      if (!remove) {
        return res.status(400).send("User cannot be found");
      } else {
        res.status(200).json(remove);
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send("Internal error");
    }
  })
);

module.exports = router;
