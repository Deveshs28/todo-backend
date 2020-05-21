const mongoose = require("mongoose");
const shortid = require("shortid");
const time = require("../libs/timeLib");
const response = require("../libs/responseLib");
const logger = require("../libs/loggerLib");
const check = require("../libs/checkLib");

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
  TodoModel.find({ createdById: req.params.userId })
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
        res.send(apiResponse);
      } else if (check.isEmpty(result)) {
        logger.info("No Todo found", "todoController:todoList", 5);
        let apiResponse = response.generate(true, "No Todo found", 404, null);
        res.send(apiResponse);
      } else {
        let apiResponse = response.generate(
          false,
          "All Todo data found",
          200,
          result
        );
        res.send(apiResponse);
      }
    });
};

let todoDetail = (req, res) => {
  let getTodoModel = () => {
    return new Promise((resolve, reject) => {
      TodoModel.findOne({ todoId: req.params.todoId })
        .select("-__v -_id")
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
            reject(apiResponse);
          } else if (check.isEmpty(result)) {
            logger.info("No Todo Found", "todoController:todoDetail");
            let apiResponse = response.generate(
              true,
              "No Todo Found",
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

  let getTodoItem = (todoModel) => {
    return new Promise((resolve, reject) => {
      TodoItemModel.findOne({ todoId: req.params.todoId })
        .select("-__v -_id")
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
            reject(apiResponse);
          } else if (check.isEmpty(result)) {
            logger.info("No Todo Found", "todoController:todoDetail");
            let apiResponse = response.generate(
              true,
              "No Todo Found",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = {
              todoId: todoModel.todoId,
              title: todoModel.title,
              items: result,
            };
            resolve(apiResponse);
          }
        });
    });
  };

  getTodoModel(req, res)
    .then(getTodoItem)
    .then((resolve) => {
      let apiResponse = response.generate(false, "Todo Detail", 200, resolve);
      res.send(apiResponse);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

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
      }).exec((req, result) => {
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
            500,
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
      let createNewTodoEditHistory = () => {
        return new Promise((resolve, reject) => {
          let newTodoHistory = new TodoItemHistoryModel({
            itemId: shortid.generate(),
            todoItemId: req.params.itemId,
            title: req.body.title,
            updatedBy: req.body.updatedBy,
            updatedById: req.body.updatedById,
            createdOn: time.now(),
          });

          createNewTodoEditHistory.save((err, newTodo) => {
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
            500,
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

      addNewChildItem.save((err, newItem) => {
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
        completed: true,
      };

      TodoItemModel.update({ itemId: req.params.itemId }, options, {
        multi: true,
      }).exec((req, result) => {
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
            500,
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
    .then(editTodoItem)
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

module.exports = {
  createTodo: createTodo,
  todoList: todoList,
  todoDetail: todoDetail,
  addItemInTodo: addItemInTodo,
  editItemInTodo: editItemInTodo,
  deleteItemInTodo: deleteItemInTodo,
  addSubItem: addSubItem,
  markTodoDone: markTodoDone,
};
