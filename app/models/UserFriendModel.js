const time = require("../libs/timeLib");

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

let userFriendScheme = new Schema({
  friendId: {
    type: String,
    default: "",
    index: true,
    unique: true,
  },
  userId: {
    type: String,
    default: "",
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  email: {
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
