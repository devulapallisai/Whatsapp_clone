const mongoose = require("mongoose");

const chatModalSchema = mongoose.Schema({
  chatName: {
    type: String,
    trim: true,
  },
  isGroupchat: Boolean,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  latestMessage: { type: String, ref: "message" },
  groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

chatModalSchema.set("timestamps", true);

const Chat = mongoose.model("Chat", chatModalSchema);
module.exports = Chat;
