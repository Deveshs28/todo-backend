const time = require("../libs/timeLib");

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

let todoScheme = new Schema({
  todoId: {
    type: String,
    default: "",
    index: true,
    unique: true,
  },
  title: {
    type: String,
    default: "",
  },
  createdBy: {
    type: String,
    default: "",
  },
  createdById: {
    type: String,
    default: "",
  },
  createdOn: {
    type: Date,
    default: time.getLocalTime(),
  },
});

mongoose.model("Todo", todoScheme);
