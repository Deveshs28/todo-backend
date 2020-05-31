const time = require("../libs/timeLib");

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

let userScheme = new Schema({
  userId: {
    type: String,
    default: "",
    index: true,
    unique: true,
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    default: "randomPassword",
  },
  email: {
    type: String,
    default: "",
  },
  mobileNumber: {
    type: String,
    default: "",
  },
  countryCode: {
    type: String,
    default: "",
  },
  createdOn: {
    type: Date,
    default: time.getLocalTime(),
  },
  notificationToken: {
    type: String,
    default: "",
  },
});

mongoose.model("User", userScheme);
