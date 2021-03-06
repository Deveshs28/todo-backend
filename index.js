const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fs = require("fs");
const http = require("http");
const appConfig = require("./config/appConfig");
const logger = require("./app/libs/loggerLib");
const routeLoggerMiddleware = require("./app/middlewares/routeLogger");
const globalErrorMiddleware = require("./app/middlewares/errorHandler");
const mongoose = require("mongoose");
var cors = require("cors");

//Declaring an instance or creating an application instance
const app = express();

app.use(cors());
app.options("*", cors());

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(globalErrorMiddleware.globalErrorHandler);
app.use(routeLoggerMiddleware.logIp);

// app.use(express.static(path.join(__dirname, "client")));

const modelsPath = "./app/models";
const routesPath = "./app/routes";

//Bootstrap models
fs.readdirSync(modelsPath).forEach(function (file) {
  if (~file.indexOf(".js")) require(modelsPath + "/" + file);
});

// Bootstrap route
fs.readdirSync(routesPath).forEach(function (file) {
  if (~file.indexOf(".js")) {
    let route = require(routesPath + "/" + file);
    route.setRouter(app);
  }
});

// calling global 404 handler after route
app.use(globalErrorMiddleware.globalNotFoundHandler);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
// start listening to http server
console.log(appConfig);
server.listen(appConfig.port);
server.on("error", onError);
server.on("listening", onListening);

const socketLib = require("./app/libs/socketLib");
const socketServer = socketLib.setServer(server);

//Event listener for HTTP server 'error' event
function onError(error) {
  if (error.syscall !== "listen") {
    logger.error(error.code + " not equal listen", "serverOnErrorHandler", 10);
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      logger.error(
        error.code + ":elavated privileges required",
        "serverOnErrorHandler",
        10
      );
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(
        error.code + ":port is already in use.",
        "serverOnErrorHandler",
        10
      );
      process.exit(1);
      break;
    default:
      logger.error(
        error.code + ":some unknown error occured",
        "serverOnErrorHandler",
        10
      );
      throw error;
  }
}

//Event listener for HTTP server 'listening' event
function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  "Listening on " + bind;
  logger.info(
    "server listening on port" + addr.port,
    "serverOnListeningHandler",
    10
  );
  let db = mongoose.connect(appConfig.db.uri, { useMongoClient: true });
}

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  // application specific logging, throwing an error, or other logic here
});

//Mongoose database connection settings
mongoose.connection.on("error", function (err) {
  console.log("database connection error");
  console.log(err);
  logger.error(err, "mongoose connection on error handler", 10);
});

mongoose.connection.on("open", function (err) {
  if (err) {
    console.log("database error");
    console.log(err);
    logger.error(err, "mongoose connection open handler", 10);
  } else {
    console.log("database connection open success");
    logger.info(
      "database connection open",
      "database connection open handler",
      10
    );
  }
});

// module.exports = app;
