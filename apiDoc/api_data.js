define({ "api": [
  {
    "group": "todo",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/todo/todoSingleItemDetail/:itemId",
    "title": "Item Detail",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "itemId",
            "description": "<p>todo item id. (path params) (required)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>token of the user. (header params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "todo",
    "name": "GetApiV1TodoTodosingleitemdetailItemid"
  },
  {
    "group": "todo",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/todolist/todo/:itemId/itemHistory",
    "title": "Item history",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "itemId",
            "description": "<p>todo item id. (path params) (required)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>token of the user. (header params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"Todo history found\",\n    \"status\": 200,\n    \"data\": [\n        {\n            \"itemId\": \"5LiXs6GxZ\",\n            \"todoItemId\": \"5TbXp6jhM\",\n            \"title\": \"New Todo sub item edited again27\",\n            \"updatedBy\": \"Devesh Sharma\",\n            \"updatedById\": \"0yi8W5mVk\",\n            \"createdOn\": \"2020-05-23T12:50:36.000Z\"\n        }\n    ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "todo",
    "name": "GetApiV1TodolistTodoItemidItemhistory"
  },
  {
    "group": "todo",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/todolist/todo/list/:userId/:page/:recordCount",
    "title": "Todo List",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>userId of the user. (path params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "page",
            "description": "<p>page number for todo list. (path params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "recordCount",
            "description": "<p>recordCount for current page. (path params) (required)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>token of the user. (header params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\n{\n        \"error\": false,\n        \"message\": \"All Todo data found\",\n        \"status\": 200,\n        \"data\": [\n            {\n                \"todoId\": \"sz5oZaNBG\",\n                \"title\": \"New Todo\",\n                \"createdBy\": \"Devesh Sharma\",\n                \"createdById\": \"0yi8W5mVk\",\n                \"createdOn\": \"2020-05-23T08:53:07.000Z\"\n            }\n        ]\n    }",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "todo",
    "name": "GetApiV1TodolistTodoListUseridPageRecordcount"
  },
  {
    "group": "todo",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/todolist/todo/view/:todoId",
    "title": "Todo Detail",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "todoId",
            "description": "<p>todo id. (path params) (required)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>token of the user. (header params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\n{\n         \"todoId\": \"sz5oZaNBG\",\n        \"items\": [\n            {\n                \"todoItemId\": \"dEroa_s_l\",\n                \"todoItem\": {\n                    \"_id\": \"5ec8e57df4991b2b3844794e\",\n                    \"itemId\": \"dEroa_s_l\",\n                    \"todoId\": \"sz5oZaNBG\",\n                    \"parentId\": \"\",\n                    \"title\": \"New Todo\",\n                    \"createdBy\": \"Devesh Sharma\",\n                    \"createdById\": \"0yi8W5mVk\",\n                    \"lastUpdatedBy\": \"\",\n                    \"lastUpdatedById\": \"\",\n                    \"createdOn\": \"2020-05-23T08:57:33.000Z\",\n                    \"updatedOn\": \"2020-05-23T08:47:47.000Z\",\n                    \"completed\": false,\n                    \"__v\": 0\n                },\n                \"child\": [\n                    {\n                        \"todoItemId\": \"Kx1SlSNqy\",\n                        \"todoItem\": {\n                            \"_id\": \"5ec901ec1d687d05e8259ce0\",\n                            \"itemId\": \"Kx1SlSNqy\",\n                            \"todoId\": \"sz5oZaNBG\",\n                            \"parentId\": \"dEroa_s_l\",\n                            \"title\": \"New Todo sub item\",\n                            \"createdBy\": \"Devesh Sharma\",\n                            \"createdById\": \"0yi8W5mVk\",\n                            \"lastUpdatedBy\": \"\",\n                            \"lastUpdatedById\": \"\",\n                            \"createdOn\": \"2020-05-23T10:58:52.000Z\",\n                            \"updatedOn\": \"2020-05-23T10:56:33.000Z\",\n                            \"completed\": false,\n                            \"__v\": 0\n                        },\n                        \"child\": []\n                    }\n                ]\n            }\n        ]\n    }",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "todo",
    "name": "GetApiV1TodolistTodoViewTodoid"
  },
  {
    "group": "todo",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/todo/create",
    "title": "Todo Create",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<p>title of the todo. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>userId of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "username",
            "description": "<p>username of the user. (body params) (required)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>token of the user. (header params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Todo created\",\n    \"status\": 200,\n    \"data\": {\n        \"todoId\": \"sz5oZaNBG\",\n        \"title\": \"New Todo\",\n        \"createdBy\": \"Devesh Sharma\",\n        \"createdById\": \"0yi8W5mVk\",\n        \"createdOn\": \"2020-05-23T08:53:07.000Z\",\n        \"_id\": \"5ec8e473f4991b2b3844794d\",\n        \"__v\": 0\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "todo",
    "name": "PostApiV1TodolistTodoCreate"
  },
  {
    "group": "todo",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/todo/:todoId/addItem",
    "title": "Add Item to todo list",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "todoId",
            "description": "<p>todoId. (path params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<p>title of the todo. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "createdBy",
            "description": "<p>username who is creating todo. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "createdById",
            "description": "<p>user id who is creating todo. (body params) (required)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>token of the user. (header params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"Todo item added\",\n    \"status\": 200,\n    \"data\": {\n        \"itemId\": \"dEroa_s_l\",\n        \"todoId\": \"sz5oZaNBG\",\n        \"parentId\": \"\",\n        \"title\": \"New Todo\",\n        \"createdBy\": \"Devesh Sharma\",\n        \"createdById\": \"0yi8W5mVk\",\n        \"lastUpdatedBy\": \"\",\n        \"lastUpdatedById\": \"\",\n        \"createdOn\": \"2020-05-23T08:57:33.000Z\",\n        \"updatedOn\": \"2020-05-23T08:47:47.000Z\",\n        \"completed\": false,\n        \"_id\": \"5ec8e57df4991b2b3844794e\",\n        \"__v\": 0\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "todo",
    "name": "PostApiV1TodolistTodoTodoidAdditem"
  },
  {
    "group": "todo",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/todo/:todoId/:itemId/addSubItem",
    "title": "Add sub item to todo item",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "todoId",
            "description": "<p>todoId. (path params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "itemId",
            "description": "<p>todo item id. (path params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<p>todo sub item title. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "createdBy",
            "description": "<p>username. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "createdById",
            "description": "<p>user id. (body params) (required)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>token of the user. (header params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"Todo sub item added\",\n    \"status\": 200,\n    \"data\": {\n        \"itemId\": \"cwItKhFPh\",\n        \"todoId\": \"sz5oZaNBG\",\n        \"parentId\": \"dEroa_s_l\",\n        \"title\": \"New Todo sub item\",\n        \"createdBy\": \"Devesh Sharma\",\n        \"createdById\": \"0yi8W5mVk\",\n        \"lastUpdatedBy\": \"\",\n        \"lastUpdatedById\": \"\",\n        \"createdOn\": \"2020-05-23T10:27:35.000Z\",\n        \"updatedOn\": \"2020-05-23T10:27:31.000Z\",\n        \"completed\": false,\n        \"_id\": \"5ec8fa97827e022a246f98ea\",\n        \"__v\": 0\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "todo",
    "name": "PostApiV1TodolistTodoTodoidItemidAddsubitem"
  },
  {
    "group": "todo",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/todo/:todoId/:itemId/deleteItem",
    "title": "Delete todo item",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "todoId",
            "description": "<p>todoId. (path params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "itemId",
            "description": "<p>todo item id. (path params) (required)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>token of the user. (header params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Todo item deleted\",\n    \"status\": 200,\n    \"data\": {\n        \"n\": 1,\n        \"ok\": 1,\n        \"deletedCount\": 1\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "todo",
    "name": "PostApiV1TodolistTodoTodoidItemidDeleteitem"
  },
  {
    "group": "todo",
    "version": "1.0.0",
    "type": "put",
    "url": "/api/v1/todolist/todo/:todoId/:itemId/editItem",
    "title": "Edit todo item",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "todoId",
            "description": "<p>todoId. (path params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "itemId",
            "description": "<p>itemId to edit. (path params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<p>updated title. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "updatedBy",
            "description": "<p>user name of user who is updating todo item. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "updatedById",
            "description": "<p>user id of user who is updating todo item. (body params) (required)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>token of the user. (header params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Todo item updated\",\n    \"status\": 200,\n    \"data\": {\n        \"itemId\": \"cwItKhFPh\",\n        \"todoId\": \"sz5oZaNBG\",\n        \"parentId\": \"dEroa_s_l\",\n        \"title\": \"New Todo sub item edited again23\",\n        \"createdBy\": \"Devesh Sharma\",\n        \"createdById\": \"0yi8W5mVk\",\n        \"lastUpdatedBy\": \"\",\n        \"lastUpdatedById\": \"\",\n        \"createdOn\": \"2020-05-23T10:27:35.000Z\",\n        \"updatedOn\": \"2020-05-23T10:27:31.000Z\",\n        \"completed\": false,\n        \"_id\": \"5ec8fa97827e022a246f98ea\",\n        \"__v\": 0\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "todo",
    "name": "PutApiV1TodolistTodoTodoidItemidEdititem"
  },
  {
    "group": "todo",
    "version": "1.0.0",
    "type": "put",
    "url": "/api/v1/todolist/todo/:todoId/:itemId/markDone",
    "title": "Mark todo item done",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "todoId",
            "description": "<p>todoId. (path params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "itemId",
            "description": "<p>todo item id. (path params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "updatedBy",
            "description": "<p>user name of user marking done. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "updatedById",
            "description": "<p>user id of user marking done. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "completed",
            "description": "<p>todo status: true :done, false reopen. (body params) (required)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>token of the user. (header params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"Todo item updated\",\n    \"status\": 200,\n    \"data\": {\n        \"n\": 1,\n        \"nModified\": 1,\n        \"ok\": 1\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "todo",
    "name": "PutApiV1TodolistTodoTodoidItemidMarkdone"
  },
  {
    "group": "todo",
    "version": "1.0.0",
    "type": "put",
    "url": "/api/v1/todolist/todo/undoTodoItem",
    "title": "Undo Todo Item",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "itemId",
            "description": "<p>todo item id. (path params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>todo item id. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userName",
            "description": "<p>todo item id. (body params) (required)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>token of the user. (header params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "todo",
    "name": "PutApiV1TodolistTodoUndotodoitem"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/todolist/user/friend/list/:userId/:page/:recordCount",
    "title": "User Friend List",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>userId of the user. (path params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "page",
            "description": "<p>page number for the record. (path params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "recordCount",
            "description": "<p>count of record for current page. (path params) (required)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>token of the user. (header params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"User Friend List found\",\n    \"status\": 200,\n    \"data\": [\n        {\n            \"friendId\": \"LaX9AJDkM\",\n            \"friendOfId\": \"JAp340ZDb\",\n            \"userId\": \"0yi8W5mVk\",\n            \"firstName\": \"Devesh\",\n            \"lastName\": \"Sharma\",\n            \"email\": \"devesh@gmail.com\",\n            \"createdOn\": \"2020-05-23T08:38:25.000Z\",\n            \"requestApproved\": false\n        }\n    ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "users",
    "name": "GetApiV1TodolistUserFriendListUseridPageRecordcount"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/todolist/user/list/:page/:recordCount",
    "title": "User List",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "page",
            "description": "<p>page number for the record. (path params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "recordCount",
            "description": "<p>count of records for current page. (path params) (required)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>token of the user. (header params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"All User data found\",\n    \"status\": 200,\n    \"data\": [\n        {\n            \"userId\": \"0yi8W5mVk\",\n            \"firstName\": \"Devesh\",\n            \"lastName\": \"Sharma\",\n            \"email\": \"devesh@gmail.com\",\n            \"mobileNumber\": 9991734971,\n            \"countryCode\": 0\n        },\n        {\n            \"userId\": \"VTqVQCAiS\",\n            \"firstName\": \"Dev\",\n            \"lastName\": \"Sharma\",\n            \"email\": \"devesh1@gmail.com\",\n            \"mobileNumber\": 9991734970,\n            \"countryCode\": 0\n        }\n    ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "users",
    "name": "GetApiV1TodolistUserListPageRecordcount"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/forgot-password",
    "title": "Forgot Password",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email of the user. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"Forgot password request processed\",\n    \"status\": 200,\n    \"data\": {\n        \"message\": \"Forgot password request processed succesfully. Please check your email inbox or spam folder for further steps.\"\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "users",
    "name": "PostApiV1TodolistForgotPassword"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/login",
    "title": "Login",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>password of the user. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"Login Successful\",\n    \"status\": 200,\n    \"data\": {\n        \"authToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Ing2Ty1jY3B2diIsImlhdCI6MTU5MDIyMDQwODY0MSwiZXhwIjoxNTkwMzA2ODA4LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJ0b2RvTGlzdCIsImRhdGEiOnsidXNlcklkIjoiVlRxVlFDQWlTIiwiZmlyc3ROYW1lIjoiRGV2IiwibGFzdE5hbWUiOiJTaGFybWEiLCJlbWFpbCI6ImRldmVzaDFAZ21haWwuY29tIiwibW9iaWxlTnVtYmVyIjo5OTkxNzM0OTcwLCJjb3VudHJ5Q29kZSI6MCwibm90aWZpY2F0aW9uVG9rZW4iOiIifX0.nJU9nWJxmNgMwCnZbRuJtmIUWOsDuLGek9GkCPeJITM\",\n        \"userDetails\": {\n            \"userId\": \"VTqVQCAiS\",\n            \"firstName\": \"Dev\",\n            \"lastName\": \"Sharma\",\n            \"email\": \"devesh1@gmail.com\",\n            \"mobileNumber\": 9991734970,\n            \"countryCode\": 0,\n            \"notificationToken\": \"\"\n        }\n    }       \n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "users",
    "name": "PostApiV1TodolistLogin"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/logout",
    "title": "Logout",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "users",
    "name": "PostApiV1TodolistLogout"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/register-pushnotification/:userId",
    "title": "Push Notifiation Registration",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>user id of the user. (path params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "notificationToken",
            "description": "<p>registration token of the user. (body params) (required)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>token of the user. (header params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"User successfully registered for push notification\",\n    \"status\": 200,\n    \"data\": {\n        \"n\": 1,\n        \"nModified\": 1,\n        \"ok\": 1\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "users",
    "name": "PostApiV1TodolistRegisterPushnotificationUserid"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/signup",
    "title": "Signup",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "mobileNumber",
            "description": "<p>mobile number of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>password of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "firstName",
            "description": "<p>first name of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "lastName",
            "description": "<p>last name of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "countryCode",
            "description": "<p>country code of the user. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n   \"error\": false,\n   \"message\": \"User created\",\n   \"status\": 200,\n   \"data\": {\n     \"userId\": \"6Rlr2ar3y\",\n     \"firstName\": \"Dev\",\n     \"lastName\": \"Sharma\",\n     \"email\": \"devesh2@gmail.com\",\n     \"mobileNumber\": 9991734970,\n     \"countryCode\": 91,\n     \"createdOn\": \"2020-05-23T07:52:24.000Z\",\n     \"notificationToken\": \"\",\n     \"_id\": \"5ec8d638e221fd0b5c6a1cb2\",\n     \"__v\": 0\n   }\n }",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "users",
    "name": "PostApiV1TodolistSignup"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/update-password/:userId",
    "title": "Update Password",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>user id of the user. (path params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>password of the user. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"User password updated\",\n    \"status\": 200,\n    \"data\": {\n        \"n\": 1,\n        \"nModified\": 1,\n        \"ok\": 1\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "users",
    "name": "PostApiV1TodolistUpdatePasswordUserid"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/user/sendRequest",
    "title": "Send Friend Request",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "senderId",
            "description": "<p>user if who is sending request. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "receiverId",
            "description": "<p>userId to whom request is sent. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "senderName",
            "description": "<p>senderName. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "receiverName",
            "description": "<p>receiverName. (body params) (required)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>token of the user. (header params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"Friend requested successfully\",\n    \"status\": 200,\n    \"data\": {\n\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "users",
    "name": "PostApiV1TodolistUserSendrequest"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "put",
    "url": "/api/v1/todolist/user/acceptRequest/:requestId",
    "title": "Accept Friend Request",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "requestId",
            "description": "<p>requestId. (path params) (required)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>token of the user. (header params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"Friend Request accepted\",\n    \"status\": 200,\n    \"data\": {\n        \"n\": 1,\n        \"nModified\": 1,\n        \"ok\": 1\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "app/routes/todolist.js",
    "groupTitle": "users",
    "name": "PutApiV1TodolistUserAcceptrequestRequestid"
  }
] });
