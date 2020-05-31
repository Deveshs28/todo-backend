const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const request = require("request");
const Auth = mongoose.model("Auth");

const logger = require("../libs/loggerLib");
const responseLib = require("../libs/responseLib");
const token = require("../libs/tokenLib");
const check = require("../libs/checkLib");

let isAuthorized = (req, res, next) => {
  if (req.header("authToken")) {
    Auth.findOne(
      {
        authToken: req.header("authToken"),
      },
      (err, authDetails) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "Authorization-Middleware", 10);
          let apiResponse = responseLib.generate(
            true,
            "Error while authorizing user",
            500,
            null
          );
          res.send(apiResponse);
        } else if (check.isEmpty(authDetails)) {
          logger.error(
            "Authorization token is not present",
            "Authorization:Middleware",
            10
          );
          let apiResponse = responseLib.generate(
            true,
            "Invalid Or Expired authorizationToken",
            401,
            null
          );
          res.send(apiResponse);
        } else {
          token.verifyToken(
            authDetails.authToken,
            authDetails.tokenSecret,
            (err, decoded) => {
              if (err) {
                logger.error(err.message, "Authorization Middleware", 10);
                let apiResponse = responseLib.generate(
                  true,
                  "Failed to authorize user",
                  401,
                  null
                );
                res.send(apiResponse);
              } else {
                req.user = { userId: decoded.data.userId };
                next();
              }
            }
          );
        }
      }
    );
  } else {
    logger.error("AuthorizationToken Missing", "AuthorizationMiddleware", 5);
    let apiResponse = responseLib.generate(
      true,
      "AuthorizationToken is missing in request body",
      400,
      null
    );
    res.send(apiResponse);
  }
};

module.exports = {
  isAuthorized: isAuthorized,
};
