define({ "api": [
  {
    "group": "Emit",
    "type": "",
    "url": "edit-todo-success",
    "title": "",
    "description": "<p>This event (&quot;edit-todo-success&quot;) has to be emitted by frontend whenever they successfully edited the todo. User can only emit this event after they after successfully edited the todo.</p>",
    "examples": [
      {
        "title": "Emit Request object",
        "content": "{\n  \"userName\": \"userName\",\n  \"action\": \"Message\",\n  \"todoItemId\": \"todoItemId\",\n  \"todoId\":\"todoId\"\n}",
        "type": "object"
      }
    ],
    "version": "0.0.0",
    "filename": "app/libs/socketLib.js",
    "groupTitle": "Emit",
    "name": "EditTodoSuccess"
  },
  {
    "group": "Emit",
    "type": "",
    "url": "todo-updated",
    "title": "",
    "description": "<p>This event (&quot;todo-updated&quot;) has to be emitted by backend whenever they listened to ('edit-todo-success').</p>",
    "examples": [
      {
        "title": "Emit request object",
        "content": "{\n   \"user\": \"userName\",\n   \"action\": \"Message\",\n   \"todoItemId\": \"todoItemId\",\n   \"todoId\":\"todoId\"\n }",
        "type": "object"
      }
    ],
    "version": "0.0.0",
    "filename": "app/libs/socketLib.js",
    "groupTitle": "Emit",
    "name": "TodoUpdated"
  },
  {
    "group": "Emit",
    "type": "",
    "url": "view-todo",
    "title": "",
    "description": "<p>This event (&quot;view-todo&quot;) has to be emitted by frontend whenever they visited any todo detail. User can only emit this event after they after successfully loggedin into the system.</p>",
    "examples": [
      {
        "title": "Emit Request object",
        "content": "{\"todoId\":\"Todo Id user viewing\"}",
        "type": "object"
      }
    ],
    "version": "0.0.0",
    "filename": "app/libs/socketLib.js",
    "groupTitle": "Emit",
    "name": "ViewTodo"
  },
  {
    "group": "Listen",
    "type": "",
    "url": "edit-todo-success",
    "title": "",
    "description": "<p>This event (&quot;edit-todo-success&quot;) has to be listened by backend to update todo action.</p>",
    "version": "0.0.0",
    "filename": "app/libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "EditTodoSuccess"
  },
  {
    "group": "Listen",
    "type": "",
    "url": "todo-updated",
    "title": "",
    "description": "<p>This event (&quot;todo-updated&quot;) has to be listened by frontend for update todo action.</p>",
    "version": "0.0.0",
    "filename": "app/libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "TodoUpdated"
  },
  {
    "group": "Listen",
    "type": "",
    "url": "view-todo",
    "title": "",
    "description": "<p>This event (&quot;view-todo&quot;) has to be listened by backend to add the connection in todo room to get updates whenever event occurred on todo item.</p>",
    "version": "0.0.0",
    "filename": "app/libs/socketLib.js",
    "groupTitle": "Listen",
    "name": "ViewTodo"
  }
] });
