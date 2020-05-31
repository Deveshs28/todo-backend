const socketio = require("socket.io");

let setServer = (server) => {
  let io = socketio.listen(server);

  let myIo = io.of("/");

  myIo.on("connection", (socket) => {
    socket.on("disconnect", () => {});

    socket.on("view-todo", (todoId) => {
      console.log("view-todo : ", todoId);
      socket.join("room-" + todoId);
    });

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
