const socketio = require("socket.io");

let setServer = (server) => {
  let io = socketio.listen(server);

  let myIo = io.of("/");

  myIo.on("connection", (socket) => {
    socket.on("disconnect", () => {});

    /**
     * @apiGroup Emit
     * @api view-todo
     * @apiDescription This event ("view-todo") has to be emitted by frontend whenever they visited any todo detail. User can only emit this event after they after successfully loggedin into the system.
     * @apiExample {object} Emit Request object
     *  {"todoId":"Todo Id user viewing"}
     */
    /**
     * @apiGroup Listen
     * @api view-todo
     * @apiDescription This event ("view-todo") has to be listened by backend to add the connection in todo room to get updates whenever event occurred on todo item.
     *
     */
    socket.on("view-todo", (todoId) => {
      console.log("view-todo : ", todoId);
      socket.join("room-" + todoId);
    });

    /**
     * @apiGroup Emit
     * @api edit-todo-success
     * @apiDescription This event ("edit-todo-success") has to be emitted by frontend whenever they successfully edited the todo. User can only emit this event after they after successfully edited the todo.
     * @apiExample {object} Emit Request object
       {
         "userName": "userName",
         "action": "Message",
         "todoItemId": "todoItemId",
         "todoId":"todoId"
       }
     */
    /**
     * @apiGroup Listen
     * @api edit-todo-success
     * @apiDescription This event ("edit-todo-success") has to be listened by backend to update todo action.
     *
     */

    /**
     * @apiGroup Emit
     * @api todo-updated
     * @apiDescription This event ("todo-updated") has to be emitted by backend whenever they listened to ('edit-todo-success').
     * @apiExample {object} Emit request object
      {
         "user": "userName",
         "action": "Message",
         "todoItemId": "todoItemId",
         "todoId":"todoId"
       }
     */
    /**
     * @apiGroup Listen
     * @api todo-updated
     * @apiDescription This event ("todo-updated") has to be listened by frontend for update todo action.
     *
     */
    socket.on("edit-todo-success", (data) => {
      console.log("edit-todo-success : ", data);
      const info = {
        user: data.userName,
        action: data.action,
        todoItemId: data.todoItemId,
        todoId: data.todoId,
      };
      console.log("data.todoId : ", data.todoId);
      const roomName = "room-" + data.todoId;
      socket.to(roomName).broadcast.emit("todo-updated", info);
    });
  });
};

module.exports = {
  setServer: setServer,
};
