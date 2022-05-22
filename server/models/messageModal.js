const mongoose = require("mongoose");

const messageModalSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  content: { type: String, trim: true },
});

messageModalSchema.set("timestamps", true);

const Message = mongoose.model("Message", messageModalSchema);
module.exports = Message;
