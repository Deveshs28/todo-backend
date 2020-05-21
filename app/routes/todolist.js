const express = require("express");
const router = express.Router();
const appConfig = require("../../config/appConfig");
const todoController = require("../controllers/todoController");
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

module.exports.setRouter = (app) => {
  let baseUrl = appConfig.apiVersion + "/todolist";

  // params: firstName, lastName, email, countryCode, mobileNumber, password.
  app.post(`${baseUrl}/signup`, userController.userSignUp);

  // params: email, password.
  app.post(`${baseUrl}/login`, userController.userLogin);
  app.post(`${baseUrl}/logout`, userController.logout);
  app.post(`${baseUrl}/forgot-password`, userController.forgotPassword);

  app.get(
    `${baseUrl}/user/friend/list/:userId`,
    auth.isAuthorized,
    userController.userFriendList
  );
  app.get(`${baseUrl}/user/list`, auth.isAuthorized, userController.userList);
  app.post(
    `${baseUrl}/user/sendRequest/:userId`,
    auth.isAuthorized,
    userController.sendRequest
  );
  app.post(
    `${baseUrl}/user/acceptRequest/:userId/:friendId`,
    auth.isAuthorized,
    userController.acceptRequest
  );

  app.post(
    `${baseUrl}/todo/create`,
    auth.isAuthorized,
    todoController.createTodo
  );
  app.get(
    `${baseUrl}/todo/list/:userId`,
    auth.isAuthorized,
    todoController.todoList
  );
  app.get(
    `${baseUrl}/todo/view/:todoId`,
    auth.isAuthorized,
    todoController.todoDetail
  );
  app.post(
    `${baseUrl}/todo/:todoId/addItem`,
    auth.isAuthorized,
    todoController.addItemInTodo
  );
  app.put(
    `${baseUrl}/todo/:todoId/:itemId/editItem`,
    auth.isAuthorized,
    todoController.editItemInTodo
  );
  app.put(
    `${baseUrl}/todo/:todoId/:itemId/markDone`,
    auth.isAuthorized,
    todoController.markTodoDone
  );
  app.post(
    `${baseUrl}/todo/:todoId/:itemId/deleteItem`,
    auth.isAuthorized,
    todoController.deleteItemInTodo
  );
  app.post(
    `${baseUrl}/todo/:todoId/:itemId/addSubItem`,
    auth.isAuthorized,
    todoController.addSubItem
  );
};
