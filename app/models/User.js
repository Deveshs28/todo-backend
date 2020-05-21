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
    type: Number,
    default: 0,
  },
  countryCode: {
    type: Number,
    default: 0,
  },
  createdOn: {
    type: Date,
    default: time.getLocalTime(),
  },
});

mongoose.model("User", userScheme);
