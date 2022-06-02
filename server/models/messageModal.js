const mongoose = require("mongoose");

// 1. Here this is model for messages which has a sender option referring to sending person details that we get from User model
// 2. Content is the message string
// 3. chat refers to chat model

const messageModalSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  content: { type: String, trim: true },
});

messageModalSchema.set("timestamps", true);

const Message = mongoose.model("Message", messageModalSchema);
module.exports = Message;
