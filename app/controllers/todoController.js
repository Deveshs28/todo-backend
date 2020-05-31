const mongoose = require("mongoose");
const shortid = require("shortid");
const time = require("../libs/timeLib");
const response = require("../libs/responseLib");
const logger = require("../libs/loggerLib");
const check = require("../libs/checkLib");
const requestPromise = require("request-promise");

const UserModel = mongoose.model("User");
const TodoModel = mongoose.model("Todo");
const TodoItemModel = mongoose.model("TodoItem");
const TodoItemHistoryModel = mongoose.model("TodoItemHistory");

let createTodo = (req, res) => {
  let validateInput = () => {
    return new Promise((resolve, reject) => {
      if (req.body.title) {
        if (check.isEmpty(req.body.title)) {
          let apiResponse = response.generate(
            true,
            "Todo title is not valid",
            400,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(req.body.userId)) {
          let apiResponse = response.generate(
            true,
            "UserId is not valid",
            400,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(req.body.username)) {
          let apiResponse = response.generate(
            true,
            "Username is not valid",
            400,
            null
          );
          reject(apiResponse);
        } else {
          resolve(req);
        }
      } else {
        logger.error(
          "Field missing error during todo creation",
          "todoController: createTodo()",
          5
        );
        let apiResponse = response.generate(
          true,
          "One or More Parameter(s) is missing",
          400,
          null
        );
        reject(apiResponse);
      }
    });
  };

  let createNewTodo = () => {
    return new Promise((resolve, reject) => {
      let newTodo = new TodoModel({
        todoId: shortid.generate(),
        title: req.body.title,
        createdBy: req.body.username,
        createdById: req.body.userId,
        createdOn: time.now(),
      });

      newTodo.save((err, newTodo) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "todoController: createTodo", 10);
          let apiResponse = response.generate(
            true,
            "Failed to create new Todo",
            500,
            null
          );
          reject(apiResponse);
        } else {
          let newTodoObj = newTodo.toObject();
          resolve(newTodoObj);
        }
      });
    });
  };

  validateInput(req, res)
    .then(createNewTodo)
    .then((resolve) => {
      let apiResponse = response.generate(false, "Todo created", 200, resolve);
      res.send(apiResponse);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

let todoList = (req, res) => {
  let validateInput = () => {
    return new Promise((resolve, reject) => {
      if (req.params.page) {
        if (req.params.recordCount) {
          resolve(req);
        } else {
          logger.error(
            "Field missing error during todo list",
            "todoController: todoList()",
            5
          );
          let apiResponse = response.generate(
            true,
            "One or More Parameter(s) is missing",
            400,
            null
          );
          reject(apiResponse);
        }
      } else {
        logger.error(
          "Field missing error during todo list",
          "todoController: todoList()",
          5
        );
        let apiResponse = response.generate(
          true,
          "One or More Parameter(s) is missing",
          400,
          null
        );
        reject(apiResponse);
      }
    });
  };

  let todoList = () => {
    return new Promise((resolve, reject) => {
      let pageNumber = parseInt(req.params.page);
      let recordCount = parseInt(req.params.recordCount);

      TodoModel.find({ createdById: req.params.userId })
        .skip(pageNumber > 0 ? (pageNumber - 1) * recordCount : 0)
        .limit(recordCount)
        .select("-__v -_id") //Hide the information which need not to send in response
        .lean() //Return plain javascript object instead of mongoose object on which we can perform function
        .exec((err, result) => {
          if (err) {
            logger.error(err.message, "todoController:todoList", 10);
            let apiResponse = response.generate(
              true,
              "Failed to find todo data",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(result)) {
            logger.info("No Todo found", "todoController:todoList", 5);
            let apiResponse = response.generate(
              true,
              "No Todo found",
              204,
              null
            );
            reject(apiResponse);
          } else {
            resolve(result);
          }
        });
    });
  };

  validateInput(req, res)
    .then(todoList)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "All Todo data found",
        200,
        resolve
      );
      res.send(apiResponse);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

let todoDetail = (req, res) => {
  TodoItemModel.find({ todoId: req.params.todoId })
    .lean()
    .exec((err, result) => {
      if (err) {
        console.log(err);
        logger.error(err.message, "todoController: todoDetail", 10);
        let apiResponse = response.generate(
          true,
          "Failed To Find Todo Details",
          500,
          null
        );
        res.send(apiResponse);
      } else if (check.isEmpty(result)) {
        logger.info("No Todo Found", "todoController:todoDetail");
        let apiResponse = response.generate(true, "No Todo Found", 404, null);
        res.send(apiResponse);
      } else {
        var respObj = [];
        for (let item of result) {
          //check if the current item is in respObj
          if (findByObjectId(respObj, item.itemId) === undefined) {
            respObj.push({
              todoItemId: item.itemId,
              todoItem: item,
              child: [],
            });
          }
          for (let res of result) {
            if (res.parentId === item.itemId) {
              if (findByObjectId(respObj, res.itemId) === undefined) {
                //add it as child of item
                var childObj = {
                  todoItemId: res.itemId,
                  todoItem: res,
                  child: [],
                };
                var updatedObj = getObjectByKey(
                  respObj,
                  "todoItemId",
                  res.parentId,
                  childObj
                );
                respObj = updatedObj;
              }
            }
          }
        }
        var apiResponse = {
          todoId: req.params.todoId,
          items: respObj,
        };
        let finalResponse = response.generate(
          false,
          "Todo Detail Found",
          200,
          apiResponse
        );
        res.send(finalResponse);
      }
    });
};

function findByObjectId(object, id) {
  if (object.itemId === id) {
    return object;
  }
  var result, p;
  for (p in object) {
    if (object.hasOwnProperty(p) && typeof object[p] === "object") {
      result = findByObjectId(object[p], id);
      if (result) {
        return result;
      }
    }
  }
  return result;
}

function getObjectByKey(obj, key, value, newObj) {
  var newObject = newObj;
  var objects = [];
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == "object") {
      objects = objects.concat(getObjectByKey(obj[i], key, value, newObject));
    } else if (i == key && obj[key] == value) {
      obj["child"].push(newObj);
    }
  }
  return obj;
}

let addItemInTodo = (req, res) => {
  let validateInput = () => {
    return new Promise((resolve, reject) => {
      if (req.params.todoId) {
        if (check.isEmpty(req.body.title)) {
          let apiResponse = response.generate(
            true,
            "Item title is not valid",
            400,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(req.body.createdBy)) {
          let apiResponse = response.generate(
            true,
            "User info is not valid",
            400,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(req.body.createdById)) {
          let apiResponse = response.generate(
            true,
            "User id is not valid",
            400,
            null
          );
          reject(apiResponse);
        } else {
          resolve(req);
        }
      } else {
        logger.error(
          "Todo Id not available during item creation",
          "todoController: addItemInTodo()",
          5
        );
        let apiResponse = response.generate(
          true,
          "One or More Parameter(s) is missing",
          400,
          null
        );
        reject(apiResponse);
      }
    });
  };

  let addNewTodoItem = () => {
    return new Promise((resolve, reject) => {
      let newTodoItem = new TodoItemModel({
        itemId: shortid.generate(),
        todoId: req.params.todoId,
        title: req.body.title,
        createdBy: req.body.createdBy,
        createdById: req.body.createdById,
        createdOn: time.now(),
      });

      newTodoItem.save((err, newItem) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "todoController: createTodoItem", 10);
          let apiResponse = response.generate(
            true,
            "Failed to create add Todo Item",
            500,
            null
          );
          reject(apiResponse);
        } else {
          let newTodoItemObj = newItem.toObject();
          resolve(newTodoItemObj);
        }
      });
    });
  };

  validateInput(req, res)
    .then(addNewTodoItem)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "Todo item added",
        200,
        resolve
      );
      res.send(apiResponse);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

let editItemInTodo = (req, res) => {
  let validateInput = () => {
    return new Promise((resolve, reject) => {
      if (req.params.todoId) {
        if (req.params.itemId) {
          if (check.isEmpty(req.body.title)) {
            let apiResponse = response.generate(
              true,
              "Item title is not valid",
              400,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(req.body.updatedBy)) {
            let apiResponse = response.generate(
              true,
              "Username is not valid",
              400,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(req.body.updatedById)) {
            let apiResponse = response.generate(
              true,
              "User id is not valid",
              400,
              null
            );
            reject(apiResponse);
          } else {
            resolve(req);
          }
        } else {
          logger.error(
            "Todo Item Id not available during item editing",
            "todoController: editItemInTodo()",
            5
          );
          let apiResponse = response.generate(
            true,
            "One or More Parameter(s) is missing",
            400,
            null
          );
          reject(apiResponse);
        }
      } else {
        logger.error(
          "Todo Id not available during item editing",
          "todoController: editItemInTodo()",
          5
        );
        let apiResponse = response.generate(
          true,
          "One or More Parameter(s) is missing",
          400,
          null
        );
        reject(apiResponse);
      }
    });
  };

  let editTodoItem = () => {
    return new Promise((resolve, reject) => {
      let options = req.body;
      TodoItemModel.update({ itemId: req.params.itemId }, options, {
        multi: true,
      }).exec((err, result) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "todoController: editTodoItem", 10);
          let apiResponse = response.generate(
            true,
            "Failed to update item",
            500,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(result)) {
          logger.error(err.message, "todoController: editTodoItem", 10);
          let apiResponse = response.generate(
            true,
            "Todo item not found",
            404,
            null
          );
          reject(apiResponse);
        } else {
          resolve(result);
        }
      });
    });
  };

  let editTodoHistoryItem = () => {
    return new Promise((resolve, reject) => {
      let newTodoHistory = new TodoItemHistoryModel({
        itemId: shortid.generate(),
        todoItemId: req.params.itemId,
        title: req.body.title,
        updatedBy: req.body.updatedBy,
        updatedById: req.body.updatedById,
        completed: false,
        createdOn: time.now(),
      });

      newTodoHistory.save((err, newTodo) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "todoController: editTodoItem", 10);
          let apiResponse = response.generate(
            true,
            "Failed to update Todo",
            500,
            null
          );
          reject(apiResponse);
        } else {
          let newTodoObj = newTodo.toObject();
          resolve(newTodoObj);
        }
      });
    });
  };

  let findTodoItem = () => {
    return new Promise((resolve, reject) => {
      TodoItemModel.findOne({ itemId: req.params.itemId }).exec(
        (err, result) => {
          resolve(result);
        }
      );
    });
  };

  let sendNotification = (todoItemModel) => {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ userId: todoItemModel.createdById }).exec(
        (err, result) => {
          if (!check.isEmpty(result)) {
            if (!check.isEmpty(result.notificationToken)) {
              const bodyContent = {
                notification: {
                  title: `Todo Edited By: ${req.body.updatedBy}`,
                  body: `Todo Item Updated. New Title : ${req.body.title}`,
                },
                to: `${result.notificationToken}`,
              };

              const options = {
                method: "POST",
                uri: "https://fcm.googleapis.com/fcm/send",
                body: bodyContent,
                json: true,
                headers: {
                  "Content-Type": "application/json",
                  Authorization:
                    "key=AAAAZAd7jNI:APA91bFKAvFNi8tBBPAtY6vQmecBSNUgLjiFWIn0R6mD9dsHEvs1pWMptzk0SjJfCJfHgUAsBWJduL8OJrBrhDF5mLhvGpum3CHeM6EOZ_opU7Clkw5KtqZw1n2p9_s_-SKKWJ3hvzga",
                },
              };

              requestPromise(options)
                .then(function (response) {
                  console.log(response);
                })
                .catch(function (err) {
                  console.log(err);
                });
            }
          }
          resolve("");
        }
      );
    });
  };

  validateInput(req, res)
    .then(editTodoItem)
    .then(editTodoHistoryItem)
    .then(findTodoItem)
    .then(sendNotification)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "Todo item updated",
        200,
        null
      );
      res.send(apiResponse);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

let deleteItemInTodo = (req, res) => {
  let validateInput = () => {
    return new Promise((resolve, reject) => {
      if (req.params.todoId) {
        if (req.params.itemId) {
          resolve(req);
        } else {
          logger.error(
            "Todo Item Id not available during item deletion",
            "todoController: deleteItemInTodo()",
            5
          );
          let apiResponse = response.generate(
            true,
            "One or More Parameter(s) is missing",
            400,
            null
          );
          reject(apiResponse);
        }
      } else {
        logger.error(
          "Todo Id not available during item deletion",
          "todoController: deleteItemInTodo()",
          5
        );
        let apiResponse = response.generate(
          true,
          "One or More Parameter(s) is missing",
          400,
          null
        );
        reject(apiResponse);
      }
    });
  };
  let deleteTodoItem = () => {
    return new Promise((resolve, reject) => {
      TodoItemModel.remove({ itemId: req.params.itemId }, (err, result) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "todoController: deleteTodoItem", 10);
          let apiResponse = response.generate(
            true,
            "Failed to delete item",
            500,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(result)) {
          logger.error(err.message, "todoController: deleteTodoItem", 10);
          let apiResponse = response.generate(
            true,
            "Todo item not found",
            404,
            null
          );
          reject(apiResponse);
        } else {
          resolve(result);
        }
      });
    });
  };

  validateInput(req, res)
    .then(deleteTodoItem)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "Todo item deleted",
        200,
        resolve
      );
      res.send(apiResponse);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

let addSubItem = (req, res) => {
  let validateInput = () => {
    return new Promise((resolve, reject) => {
      if (req.params.todoId) {
        if (req.params.itemId) {
          if (check.isEmpty(req.body.title)) {
            let apiResponse = response.generate(
              true,
              "Item title is not valid",
              400,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(req.body.createdBy)) {
            let apiResponse = response.generate(
              true,
              "User name is not valid",
              400,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(req.body.createdById)) {
            let apiResponse = response.generate(
              true,
              "User Id is not valid",
              400,
              null
            );
            reject(apiResponse);
          } else {
            resolve(req);
          }
        } else {
          logger.error(
            "Todo Item Id not available during item creation",
            "todoController: addSubItem()",
            5
          );
          let apiResponse = response.generate(
            true,
            "One or More Parameter(s) is missing",
            400,
            null
          );
          reject(apiResponse);
        }
      } else {
        logger.error(
          "Todo Id not available during item creation",
          "todoController: addSubItem()",
          5
        );
        let apiResponse = response.generate(
          true,
          "One or More Parameter(s) is missing",
          400,
          null
        );
        reject(apiResponse);
      }
    });
  };

  let addNewChildItem = () => {
    return new Promise((resolve, reject) => {
      let newchildItem = new TodoItemModel({
        itemId: shortid.generate(),
        todoId: req.params.todoId,
        parentId: req.params.itemId,
        title: req.body.title,
        createdBy: req.body.createdBy,
        createdById: req.body.createdById,
        createdOn: time.now(),
      });

      newchildItem.save((err, newItem) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "todoController: addSubItem", 10);
          let apiResponse = response.generate(
            true,
            "Failed to add Todo Item",
            500,
            null
          );
          reject(apiResponse);
        } else {
          let newTodoItemObj = newItem.toObject();
          resolve(newTodoItemObj);
        }
      });
    });
  };

  validateInput(req, res)
    .then(addNewChildItem)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "Todo sub item added",
        200,
        resolve
      );
      res.send(apiResponse);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

let markTodoDone = (req, res) => {
  let validateInput = () => {
    return new Promise((resolve, reject) => {
      if (req.params.todoId) {
        if (req.params.itemId) {
          if (check.isEmpty(req.body.updatedBy)) {
            let apiResponse = response.generate(
              true,
              "Username is not valid",
              400,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(req.body.updatedById)) {
            let apiResponse = response.generate(
              true,
              "User id is not valid",
              400,
              null
            );
            reject(apiResponse);
          } else {
            resolve(req);
          }
        } else {
          logger.error(
            "Todo Item Id not available during item marking done",
            "todoController: markTodoDone()",
            5
          );
          let apiResponse = response.generate(
            true,
            "One or More Parameter(s) is missing",
            400,
            null
          );
          reject(apiResponse);
        }
      } else {
        logger.error(
          "Todo Id not available during item marking done",
          "todoController: markTodoDone()",
          5
        );
        let apiResponse = response.generate(
          true,
          "One or More Parameter(s) is missing",
          400,
          null
        );
        reject(apiResponse);
      }
    });
  };

  let editTodoItem = () => {
    return new Promise((resolve, reject) => {
      let options = {
        itemId: req.params.itemId,
        todoId: req.params.todoId,
        lastUpdatedBy: req.body.updatedBy,
        lastUpdatedById: req.body.updatedById,
        updatedOn: time.now(),
        completed: req.body.completed,
      };

      TodoItemModel.update({ itemId: req.params.itemId }, options, {
        multi: true,
      }).exec((err, result) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "todoController: markTodoDone", 10);
          let apiResponse = response.generate(
            true,
            "Failed to update item",
            500,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(result)) {
          logger.error(err.message, "todoController: markTodoDone", 10);
          let apiResponse = response.generate(
            true,
            "Todo item not found",
            404,
            null
          );
          reject(apiResponse);
        } else {
          resolve(result);
        }
      });
    });
  };

  let editTodoHistoryItem = () => {
    return new Promise((resolve, reject) => {
      let newTodoHistory = new TodoItemHistoryModel({
        itemId: shortid.generate(),
        todoItemId: req.params.itemId,
        title: "Mark|-|-|Done",
        updatedBy: req.body.updatedBy,
        updatedById: req.body.updatedById,
        completed: req.body.completed,
        createdOn: time.now(),
      });

      newTodoHistory.save((err, newTodo) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "todoController: editTodoItem", 10);
          let apiResponse = response.generate(
            true,
            "Failed to update Todo",
            500,
            null
          );
          reject(apiResponse);
        } else {
          let newTodoObj = newTodo.toObject();
          resolve(newTodoObj);
        }
      });
    });
  };

  validateInput(req, res)
    .then(editTodoItem)
    .then(editTodoHistoryItem)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "Todo item updated",
        200,
        resolve
      );
      res.send(apiResponse);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

let itemHistory = (req, res) => {
  TodoItemHistoryModel.find({ todoItemId: req.params.itemId })
    .select("-__v -_id") //Hide the information which need not to send in response
    .lean() //Return plain javascript object instead of mongoose object on which we can perform function
    .sort({ createdOn: -1 })
    .exec((err, result) => {
      if (err) {
        logger.error(err.message, "todoController:itemHistory", 10);
        let apiResponse = response.generate(
          true,
          "Failed to find todo history data",
          500,
          null
        );
        res.send(apiResponse);
      } else if (check.isEmpty(result)) {
        logger.info("No Todo history found", "todoController:itemHistory", 5);
        let apiResponse = response.generate(
          true,
          "No Todo history found",
          204,
          null
        );
        res.send(apiResponse);
      } else {
        let apiResponse = response.generate(
          false,
          "Todo history found",
          200,
          result
        );
        res.send(apiResponse);
      }
    });
};

let itemSingleItemDetail = (req, res) => {
  let validateInput = () => {
    return new Promise((resolve, reject) => {
      if (req.params.itemId) {
        resolve(req);
      } else {
        logger.error(
          "Todo Item Id not available during item detail",
          "todoController: itemSingleItemDetail()",
          5
        );
        let apiResponse = response.generate(
          true,
          "One or More Parameter(s) is missing",
          400,
          null
        );
        reject(apiResponse);
      }
    });
  };

  let findTodoItem = () => {
    return new Promise((resolve, reject) => {
      TodoItemModel.findOne({ itemId: req.params.itemId }).exec(
        (err, result) => {
          if (err) {
            let apiResponse = response.generate(
              true,
              "Error while getting todo item",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(
              true,
              "Todo Item detail not found",
              400,
              null
            );
            reject(apiResponse);
          } else {
            resolve(result);
          }
        }
      );
    });
  };

  validateInput(req, res)
    .then(findTodoItem)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "Todo Item Detail Found",
        200,
        resolve
      );
      res.send(apiResponse);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

let undoTodoItem = (req, res) => {
  let validateInput = () => {
    return new Promise((resolve, reject) => {
      if (req.params.itemId) {
        if (check.isEmpty(req.body.userId)) {
          let apiResponse = response.generate(
            true,
            "User Id is not valid",
            400,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(req.body.userName)) {
          let apiResponse = response.generate(
            true,
            "Username is not valid",
            400,
            null
          );
          reject(apiResponse);
        } else {
          resolve(req);
        }
      } else {
        logger.error(
          "Todo Item Id not available during item detail",
          "todoController: itemSingleItemDetail()",
          5
        );
        let apiResponse = response.generate(
          true,
          "One or More Parameter(s) is missing",
          400,
          null
        );
        reject(apiResponse);
      }
    });
  };

  let findLastestHistoryRecord = () => {
    return new Promise((resolve, reject) => {
      TodoItemHistoryModel.findOne({ todoItemId: req.params.itemId })
        .select("-__v -_id") //Hide the information which need not to send in response
        .lean() //Return plain javascript object instead of mongoose object on which we can perform function
        .sort({ createdOn: -1 })
        .limit(1)
        .exec((err, result) => {
          if (err) {
            logger.error(err.message, "todoController:itemHistory", 10);
            let apiResponse = response.generate(
              true,
              "Failed to find todo history data",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(result)) {
            logger.info(
              "No Todo history found",
              "todoController:itemHistory",
              5
            );
            let apiResponse = response.generate(
              true,
              "No Todo history found",
              204,
              null
            );
            reject(apiResponse);
          } else {
            resolve(result);
          }
        });
    });
  };

  let performUndoOperation = (todoHistoryItem) => {
    return new Promise((resolve, reject) => {
      let option;
      if (todoHistoryItem.title === "Mark|-|-|Done") {
        option = {
          completed: todoHistoryItem.completed,
          updatedOn: time.getLocalTime(),
          lastUpdatedBy: req.body.userName,
          lastUpdatedById: req.body.userId,
        };
        //update complete status
      } else {
        option = {
          title: todoHistoryItem.title,
          updatedOn: time.getLocalTime(),
          lastUpdatedBy: req.body.userName,
          lastUpdatedById: req.body.userId,
        };
        //update title
      }
      TodoItemModel.update({ itemId: req.params.itemId }, option, {
        multi: true,
      }).exec((err, result) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "todoController: editTodoItem", 10);
          let apiResponse = response.generate(
            true,
            "Failed to update item",
            500,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(result)) {
          logger.error(err.message, "todoController: editTodoItem", 10);
          let apiResponse = response.generate(
            true,
            "Todo item not found",
            404,
            null
          );
          reject(apiResponse);
        } else {
          console.log(result);
          resolve(result);
        }
      });
    });
  };

  let removeHistoryEntryFromTable = () => {
    return new Promise((resolve, reject) => {
      TodoItemHistoryModel.findOneAndDelete(
        { todoItemId: req.params.itemId },
        { sort: { createdOn: -1 } }
      ).exec((err, result) => {
        if (err) {
          console.log(err);
          logger.error(
            err.message,
            "todoController: deleteTodoItemHistory",
            10
          );
          let apiResponse = response.generate(
            true,
            "Failed to delete item",
            500,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(result)) {
          logger.error(err.message, "todoController: deleteTodoItem", 10);
          let apiResponse = response.generate(
            true,
            "Todo item not found",
            404,
            null
          );
          reject(apiResponse);
        } else {
          resolve(result);
        }
      });
    });
  };
  validateInput(req, res)
    .then(findLastestHistoryRecord)
    .then(performUndoOperation)
    .then(removeHistoryEntryFromTable)
    .then((resolve) => {
      let apiResponse = response.generate(false, "Undo Successfull", 200, null);
      res.send(apiResponse);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

module.exports = {
  createTodo: createTodo,
  todoList: todoList,
  todoDetail: todoDetail,
  addItemInTodo: addItemInTodo,
  editItemInTodo: editItemInTodo,
  deleteItemInTodo: deleteItemInTodo,
  addSubItem: addSubItem,
  markTodoDone: markTodoDone,
  itemHistory: itemHistory,
  itemSingleItemDetail: itemSingleItemDetail,
  undoTodoItem: undoTodoItem,
};
