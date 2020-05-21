const time = require("../libs/timeLib");

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

let todoItemScheme = new Schema({
  itemId: {
    type: String,
    default: "",
    index: true,
    unique: true,
  },
  todoId: {
    type: String,
    default: "",
  },
  parentId: {
    type: String,
    default: "",
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
  lastUpdatedBy: {
    type: String,
    default: "",
  },
  lastUpdatedById: {
    type: String,
    default: "",
  },
  createdOn: {
    type: Date,
    default: time.getLocalTime(),
  },
  updatedOn: {
    type: Date,
    default: time.getLocalTime(),
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

mongoose.model("TodoItem", todoItemScheme);
