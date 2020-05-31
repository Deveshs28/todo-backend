const time = require("../libs/timeLib");

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

let todoUpdateHistoryItemScheme = new Schema({
  itemId: {
    type: String,
    default: "",
    index: true,
    unique: true,
  },
  todoItemId: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  updatedBy: {
    type: String,
    default: "",
  },
  updatedById: {
    type: String,
    default: "",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
    default: time.getLocalTime(),
  },
});

mongoose.model("TodoItemHistory", todoUpdateHistoryItemScheme);
