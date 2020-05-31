const time = require("../libs/timeLib");

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

let userFriendScheme = new Schema({
  requestId: {
    type: String,
    default: "",
    index: true,
    unique: true,
  },
  senderId: {
    type: String,
    default: "",
  },
  receiverId: {
    type: String,
    default: "",
  },
  senderName: {
    type: String,
    default: "",
  },
  receiverName: {
    type: String,
    default: "",
  },
  createdOn: {
    type: Date,
    default: time.getLocalTime(),
  },
  requestApproved: {
    type: Boolean,
    default: false,
  },
});

mongoose.model("UserFriend", userFriendScheme);
