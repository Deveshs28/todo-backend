const express = require("express");
const router = express.Router();
const appConfig = require("../../config/appConfig");
const todoController = require("../controllers/todoController");
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

module.exports.setRouter = (app) => {
  let baseUrl = appConfig.apiVersion + "/todolist";

  /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todolist/signup Signup
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {number} mobileNumber mobile number of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * @apiParam {string} firstName first name of the user. (body params) (required)
     * @apiParam {string} lastName last name of the user. (body params) (required)
     * @apiParam {string} countryCode country code of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "User created",
            "status": 200,
            "data": {
              "userId": "6Rlr2ar3y",
              "firstName": "Dev",
              "lastName": "Sharma",
              "email": "devesh2@gmail.com",
              "mobileNumber": 9991734970,
              "countryCode": 91,
              "createdOn": "2020-05-23T07:52:24.000Z",
              "notificationToken": "",
              "_id": "5ec8d638e221fd0b5c6a1cb2",
              "__v": 0
            }
          }
    */
  app.post(`${baseUrl}/signup`, userController.userSignUp);

  /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todolist/login Login
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Login Successful",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Ing2Ty1jY3B2diIsImlhdCI6MTU5MDIyMDQwODY0MSwiZXhwIjoxNTkwMzA2ODA4LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJ0b2RvTGlzdCIsImRhdGEiOnsidXNlcklkIjoiVlRxVlFDQWlTIiwiZmlyc3ROYW1lIjoiRGV2IiwibGFzdE5hbWUiOiJTaGFybWEiLCJlbWFpbCI6ImRldmVzaDFAZ21haWwuY29tIiwibW9iaWxlTnVtYmVyIjo5OTkxNzM0OTcwLCJjb3VudHJ5Q29kZSI6MCwibm90aWZpY2F0aW9uVG9rZW4iOiIifX0.nJU9nWJxmNgMwCnZbRuJtmIUWOsDuLGek9GkCPeJITM",
                "userDetails": {
                    "userId": "VTqVQCAiS",
                    "firstName": "Dev",
                    "lastName": "Sharma",
                    "email": "devesh1@gmail.com",
                    "mobileNumber": 9991734970,
                    "countryCode": 0,
                    "notificationToken": ""
                }
            }       
        }

    */
  app.post(`${baseUrl}/login`, userController.userLogin);

  /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todolist/logout Logout
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
            {
                
            }
         
    */
  app.post(`${baseUrl}/logout/:userId`, userController.logout);

  /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todolist/forgot-password Forgot Password
     *
     * @apiParam {string} email email of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Forgot password request processed",
            "status": 200,
            "data": {
                "message": "Forgot password request processed succesfully. Please check your email inbox or spam folder for further steps."
            }
        }

    */
  app.post(`${baseUrl}/forgot-password`, userController.forgotPassword);

  /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todolist/update-password/:userId Update Password
     *
     * @apiParam {string} userId user id of the user. (path params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "User password updated",
            "status": 200,
            "data": {
                "n": 1,
                "nModified": 1,
                "ok": 1
            }
        }

    */
  app.post(`${baseUrl}/update-password/:userId`, userController.updatePassword);

  /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todolist/register-pushnotification/:userId Push Notifiation Registration
     *
     * @apiParam {string} userId user id of the user. (path params) (required)
     * @apiParam {string} notificationToken registration token of the user. (body params) (required)
     * @apiHeader {string} authToken  token of the user. (header params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "User successfully registered for push notification",
            "status": 200,
            "data": {
                "n": 1,
                "nModified": 1,
                "ok": 1
            }
        }

    */
  app.post(
    `${baseUrl}/register-pushnotification/:userId`,
    auth.isAuthorized,
    userController.registerPushNotification
  );

  /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/todolist/user/friend/list/:userId/:page/:recordCount User Friend List
     *
     * @apiParam {string} userId userId of the user. (path params) (required)
     * @apiParam {string} page page number for the record. (path params) (required)
     * @apiParam {string} recordCount count of record for current page. (path params) (required)
     * 
     * @apiHeader {string} authToken  token of the user. (header params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "User Friend List found",
            "status": 200,
            "data": [
                {
                    "friendId": "LaX9AJDkM",
                    "friendOfId": "JAp340ZDb",
                    "userId": "0yi8W5mVk",
                    "firstName": "Devesh",
                    "lastName": "Sharma",
                    "email": "devesh@gmail.com",
                    "createdOn": "2020-05-23T08:38:25.000Z",
                    "requestApproved": false
                }
            ]
        }

    */
  app.get(
    `${baseUrl}/user/friend/list/:userId/:page/:recordCount`,
    auth.isAuthorized,
    userController.userFriendList
  );

  /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/todolist/user/list/:page/:recordCount User List
     *
     * @apiParam {string} userId userId of the user getting list. (path params) (required)
     * @apiParam {string} page page number for the record. (path params) (required)
     * @apiParam {string} recordCount count of records for current page. (path params) (required)
     * 
     * @apiHeader {string} authToken  token of the user. (header params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "All User data found",
            "status": 200,
            "data": [
                {
                    "userId": "0yi8W5mVk",
                    "firstName": "Devesh",
                    "lastName": "Sharma",
                    "email": "devesh@gmail.com",
                    "mobileNumber": 9991734971,
                    "countryCode": 0
                },
                {
                    "userId": "VTqVQCAiS",
                    "firstName": "Dev",
                    "lastName": "Sharma",
                    "email": "devesh1@gmail.com",
                    "mobileNumber": 9991734970,
                    "countryCode": 0
                }
            ]
        }
    */
  app.get(
    `${baseUrl}/user/list/:userId/:page/:recordCount`,
    auth.isAuthorized,
    userController.userList
  );

  /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todolist/user/sendRequest Send Friend Request
     *
     * @apiParam {string} senderId user if who is sending request. (body params) (required)
     * @apiParam {string} receiverId userId to whom request is sent. (body params) (required)
     * @apiParam {string} senderName senderName. (body params) (required)
     * @apiParam {string} receiverName receiverName. (body params) (required)
     * 
     * @apiHeader {string} authToken  token of the user. (header params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Friend requested successfully",
            "status": 200,
            "data": {
        
            }
        }

    */
  app.post(
    `${baseUrl}/user/sendRequest`,
    auth.isAuthorized,
    userController.sendRequest
  );

  /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {put} /api/v1/todolist/user/acceptRequest/:requestId Accept Friend Request
     *
     * @apiParam {string} requestId requestId. (path params) (required)
     * 
     * @apiHeader {string} authToken  token of the user. (header params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Friend Request accepted",
            "status": 200,
            "data": {
                "n": 1,
                "nModified": 1,
                "ok": 1
            }
        }
    */
  app.put(
    `${baseUrl}/user/acceptRequest/:requestId`,
    auth.isAuthorized,
    userController.acceptRequest
  );

  /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todolist/todo/create Todo Create
     *
     * @apiParam {string} title title of the todo. (body params) (required)
     * @apiParam {string} userId userId of the user. (body params) (required)
     * @apiParam {string} username username of the user. (body params) (required)
     * 
     * @apiHeader {string} authToken  token of the user. (header params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Todo created",
            "status": 200,
            "data": {
                "todoId": "sz5oZaNBG",
                "title": "New Todo",
                "createdBy": "Devesh Sharma",
                "createdById": "0yi8W5mVk",
                "createdOn": "2020-05-23T08:53:07.000Z",
                "_id": "5ec8e473f4991b2b3844794d",
                "__v": 0
            }
        }

    */
  app.post(
    `${baseUrl}/todo/create`,
    auth.isAuthorized,
    todoController.createTodo
  );

  /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {get} /api/v1/todolist/todo/list/:userId/:page/:recordCount Todo List
     *
     * @apiParam {string} userId userId of the user. (path params) (required)
     * @apiParam {string} page page number for todo list. (path params) (required)
     * @apiParam {string} recordCount recordCount for current page. (path params) (required)
     * 
     * @apiHeader {string} authToken  token of the user. (header params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
     * {
        "error": false,
        "message": "All Todo data found",
        "status": 200,
        "data": [
            {
                "todoId": "sz5oZaNBG",
                "title": "New Todo",
                "createdBy": "Devesh Sharma",
                "createdById": "0yi8W5mVk",
                "createdOn": "2020-05-23T08:53:07.000Z"
            }
        ]
    }
     * 
    */
  app.get(
    `${baseUrl}/todo/list/:userId/:page/:recordCount`,
    auth.isAuthorized,
    todoController.todoList
  );

  /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {get} /api/v1/todolist/todo/view/:todoId Todo Detail
     *
     * @apiParam {string} todoId todo id. (path params) (required)
     * 
     * @apiHeader {string} authToken  token of the user. (header params) (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
     * {
         "todoId": "sz5oZaNBG",
        "items": [
            {
                "todoItemId": "dEroa_s_l",
                "todoItem": {
                    "_id": "5ec8e57df4991b2b3844794e",
                    "itemId": "dEroa_s_l",
                    "todoId": "sz5oZaNBG",
                    "parentId": "",
                    "title": "New Todo",
                    "createdBy": "Devesh Sharma",
                    "createdById": "0yi8W5mVk",
                    "lastUpdatedBy": "",
                    "lastUpdatedById": "",
                    "createdOn": "2020-05-23T08:57:33.000Z",
                    "updatedOn": "2020-05-23T08:47:47.000Z",
                    "completed": false,
                    "__v": 0
                },
                "child": [
                    {
                        "todoItemId": "Kx1SlSNqy",
                        "todoItem": {
                            "_id": "5ec901ec1d687d05e8259ce0",
                            "itemId": "Kx1SlSNqy",
                            "todoId": "sz5oZaNBG",
                            "parentId": "dEroa_s_l",
                            "title": "New Todo sub item",
                            "createdBy": "Devesh Sharma",
                            "createdById": "0yi8W5mVk",
                            "lastUpdatedBy": "",
                            "lastUpdatedById": "",
                            "createdOn": "2020-05-23T10:58:52.000Z",
                            "updatedOn": "2020-05-23T10:56:33.000Z",
                            "completed": false,
                            "__v": 0
                        },
                        "child": []
                    }
                ]
            }
        ]
    }

    */
  app.get(
    `${baseUrl}/todo/view/:todoId`,
    auth.isAuthorized,
    todoController.todoDetail
  );

  /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todolist/todo/:todoId/addItem Add Item to todo list
     *
     * @apiParam {string} todoId todoId. (path params) (required)
     * @apiParam {string} title title of the todo. (body params) (required)
     * @apiParam {string} createdBy username who is creating todo. (body params) (required)
     * @apiParam {string} createdById user id who is creating todo. (body params) (required)
     * 
     * @apiHeader {string} authToken  token of the user. (header params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Todo item added",
            "status": 200,
            "data": {
                "itemId": "dEroa_s_l",
                "todoId": "sz5oZaNBG",
                "parentId": "",
                "title": "New Todo",
                "createdBy": "Devesh Sharma",
                "createdById": "0yi8W5mVk",
                "lastUpdatedBy": "",
                "lastUpdatedById": "",
                "createdOn": "2020-05-23T08:57:33.000Z",
                "updatedOn": "2020-05-23T08:47:47.000Z",
                "completed": false,
                "_id": "5ec8e57df4991b2b3844794e",
                "__v": 0
            }
        }

    */
  app.post(
    `${baseUrl}/todo/:todoId/addItem`,
    auth.isAuthorized,
    todoController.addItemInTodo
  );

  /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {put} /api/v1/todolist/todo/:todoId/:itemId/editItem Edit todo item
     *
     * @apiParam {string} todoId todoId. (path params) (required)
     * @apiParam {string} itemId itemId to edit. (path params) (required)
     * @apiParam {string} title updated title. (body params) (required)
     * @apiParam {string} updatedBy user name of user who is updating todo item. (body params) (required)
     * @apiParam {string} updatedById user id of user who is updating todo item. (body params) (required)
     * 
     * @apiHeader {string} authToken  token of the user. (header params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Todo item updated",
            "status": 200,
            "data": {
                "itemId": "cwItKhFPh",
                "todoId": "sz5oZaNBG",
                "parentId": "dEroa_s_l",
                "title": "New Todo sub item edited again23",
                "createdBy": "Devesh Sharma",
                "createdById": "0yi8W5mVk",
                "lastUpdatedBy": "",
                "lastUpdatedById": "",
                "createdOn": "2020-05-23T10:27:35.000Z",
                "updatedOn": "2020-05-23T10:27:31.000Z",
                "completed": false,
                "_id": "5ec8fa97827e022a246f98ea",
                "__v": 0
            }
        }

    */
  app.put(
    `${baseUrl}/todo/:todoId/:itemId/editItem`,
    auth.isAuthorized,
    todoController.editItemInTodo
  );

  /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {put} /api/v1/todolist/todo/:todoId/:itemId/markDone Mark todo item done
     *
     * @apiParam {string} todoId todoId. (path params) (required)
     * @apiParam {string} itemId todo item id. (path params) (required)
     * @apiParam {string} updatedBy user name of user marking done. (body params) (required)
     * @apiParam {string} updatedById user id of user marking done. (body params) (required)
     * @apiParam {boolean} completed todo status: true :done, false reopen. (body params) (required)
     * 
     * @apiHeader {string} authToken  token of the user. (header params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Todo item updated",
            "status": 200,
            "data": {
                "n": 1,
                "nModified": 1,
                "ok": 1
            }
        }

    */
  app.put(
    `${baseUrl}/todo/:todoId/:itemId/markDone`,
    auth.isAuthorized,
    todoController.markTodoDone
  );

  /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todolist/todo/:todoId/:itemId/deleteItem Delete todo item
     *
     * @apiParam {string} todoId todoId. (path params) (required)
     * @apiParam {string} itemId todo item id. (path params) (required)
     * 
     * @apiHeader {string} authToken  token of the user. (header params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Todo item deleted",
            "status": 200,
            "data": {
                "n": 1,
                "ok": 1,
                "deletedCount": 1
            }
        }

    */
  app.post(
    `${baseUrl}/todo/:todoId/:itemId/deleteItem`,
    auth.isAuthorized,
    todoController.deleteItemInTodo
  );

  /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todolist/todo/:todoId/:itemId/addSubItem Add sub item to todo item
     *
     * @apiParam {string} todoId todoId. (path params) (required)
     * @apiParam {string} itemId todo item id. (path params) (required)
     * @apiParam {string} title todo sub item title. (body params) (required)
     * @apiParam {string} createdBy username. (body params) (required)
     * @apiParam {string} createdById user id. (body params) (required)
     * 
     * @apiHeader {string} authToken  token of the user. (header params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Todo sub item added",
            "status": 200,
            "data": {
                "itemId": "cwItKhFPh",
                "todoId": "sz5oZaNBG",
                "parentId": "dEroa_s_l",
                "title": "New Todo sub item",
                "createdBy": "Devesh Sharma",
                "createdById": "0yi8W5mVk",
                "lastUpdatedBy": "",
                "lastUpdatedById": "",
                "createdOn": "2020-05-23T10:27:35.000Z",
                "updatedOn": "2020-05-23T10:27:31.000Z",
                "completed": false,
                "_id": "5ec8fa97827e022a246f98ea",
                "__v": 0
            }
        }

    */
  app.post(
    `${baseUrl}/todo/:todoId/:itemId/addSubItem`,
    auth.isAuthorized,
    todoController.addSubItem
  );

  /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {get} /api/v1/todolist/todo/:itemId/itemHistory Item history
     *
     * @apiParam {string} itemId todo item id. (path params) (required)
     * 
     * @apiHeader {string} authToken  token of the user. (header params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Todo history found",
            "status": 200,
            "data": [
                {
                    "itemId": "5LiXs6GxZ",
                    "todoItemId": "5TbXp6jhM",
                    "title": "New Todo sub item edited again27",
                    "updatedBy": "Devesh Sharma",
                    "updatedById": "0yi8W5mVk",
                    "createdOn": "2020-05-23T12:50:36.000Z"
                }
            ]
        }

    */
  app.get(
    `${baseUrl}/todo/:itemId/itemHistory`,
    auth.isAuthorized,
    todoController.itemHistory
  );

  /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {get} /api/v1/todo/todoSingleItemDetail/:itemId Item Detail
     *
     * @apiParam {string} itemId todo item id. (path params) (required)
     * 
     * @apiHeader {string} authToken  token of the user. (header params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
        }
    */

  app.get(
    `${baseUrl}/todo/todoSingleItemDetail/:itemId`,
    auth.isAuthorized,
    todoController.itemSingleItemDetail
  );

  /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {put} /api/v1/todolist/todo/undoTodoItem Undo Todo Item
     * 
     * @apiParam {string} itemId todo item id. (path params) (required)
     * @apiParam {string} userId todo item id. (body params) (required)
     * @apiParam {string} userName todo item id. (body params) (required)
     *
     * @apiHeader {string} authToken  token of the user. (header params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
        }
    */
  app.put(
    `${baseUrl}/todo/undoTodoItem/:itemId`,
    auth.isAuthorized,
    todoController.undoTodoItem
  );
};
