const mongoose = require("mongoose");
const shortid = require("shortid");
const time = require("../libs/timeLib");
const response = require("../libs/responseLib");
const logger = require("../libs/loggerLib");
const validateInput = require("../libs/paramsValidationLib");
const check = require("../libs/checkLib");
const passwordLib = require("../libs/generatePasswordLib");
const token = require("../libs/tokenLib");

const UserModel = mongoose.model("User");
const UserFriendModel = mongoose.model("UserFriend");
const AuthModel = mongoose.model("Auth");

const nodemailer = require("nodemailer");

let userSignUp = (req, res) => {
  let validateUserInput = () => {
    return new Promise((resolve, reject) => {
      console.log(req.body);
      if (req.body.email) {
        if (!validateInput.Email(req.body.email)) {
          let apiResponse = response.generate(
            true,
            "Email is not valid",
            400,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(req.body.mobileNumber)) {
          let apiResponse = response.generate(
            true,
            "Mobile Number is missing",
            400,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(req.body.password)) {
          let apiResponse = response.generate(
            true,
            "Password is missing",
            400,
            null
          );
          reject(apiResponse);
        } else {
          resolve(req);
        }
      } else {
        logger.error(
          "Field missing error during user creation",
          "userController: createUser()",
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

  let createUser = () => {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ email: req.body.email }).exec(
        (err, retrievedUserDetails) => {
          if (err) {
            logger.error(err.message, "userController: createUser", 10);
            let apiResponse = response.generate(
              true,
              "Failed To Create User",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(retrievedUserDetails)) {
            console.log(req.body);
            let newUser = new UserModel({
              userId: shortid.generate(),
              firstName: req.body.firstName,
              lastName: req.body.lastName || "",
              email: req.body.email.toLowerCase(),
              mobileNumber: req.body.mobileNumber,
              password: passwordLib.hashpassword(req.body.password),
              createdOn: time.now(),
            });
            newUser.save((err, newUser) => {
              if (err) {
                console.log(err);
                logger.error(err.message, "userController: createUser", 10);
                let apiResponse = response.generate(
                  true,
                  "Failed to create new User",
                  500,
                  null
                );
                reject(apiResponse);
              } else {
                let newUserObj = newUser.toObject();
                resolve(newUserObj);
              }
            });
          } else {
            logger.error(
              "User Cannot Be Created.User Already Present",
              "userController: createUser",
              4
            );
            let apiResponse = response.generate(
              true,
              "User Already Present With this Email",
              403,
              null
            );
            reject(apiResponse);
          }
        }
      );
    });
  };

  validateUserInput(req, res)
    .then(createUser)
    .then((resolve) => {
      delete resolve.password;
      let apiResponse = response.generate(false, "User created", 200, resolve);
      res.send(apiResponse);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

let userLogin = (req, res) => {
  let findUser = () => {
    console.log("findUser");
    return new Promise((resolve, reject) => {
      if (req.body.email) {
        console.log("req body email is there");
        console.log(req.body);
        UserModel.findOne({ email: req.body.email }, (err, userDetails) => {
          if (err) {
            console.log(err);
            logger.error(
              "Failed To Retrieve User Data",
              "userController: findUser()",
              10
            );
            let apiResponse = response.generate(
              true,
              "Failed To Find User Details",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(userDetails)) {
            logger.error("No User Found", "userController: findUser()", 7);
            let apiResponse = response.generate(
              true,
              "No User Details Found",
              404,
              null
            );
            reject(apiResponse);
          } else {
            logger.info("User Found", "userController: findUser()", 10);
            resolve(userDetails);
          }
        });
      } else {
        let apiResponse = response.generate(
          true,
          '"email" parameter is missing',
          400,
          null
        );
        reject(apiResponse);
      }
    });
  };
  let validatePassword = (retrievedUserDetails) => {
    console.log("validatePassword");
    return new Promise((resolve, reject) => {
      passwordLib.comparePassword(
        req.body.password,
        retrievedUserDetails.password,
        (err, isMatch) => {
          if (err) {
            console.log(err);
            logger.error(err.message, "userController: validatePassword()", 10);
            let apiResponse = response.generate(
              true,
              "Login Failed",
              500,
              null
            );
            reject(apiResponse);
          } else if (isMatch) {
            let retrievedUserDetailsObj = retrievedUserDetails.toObject();
            delete retrievedUserDetailsObj.password;
            delete retrievedUserDetailsObj._id;
            delete retrievedUserDetailsObj.__v;
            delete retrievedUserDetailsObj.createdOn;
            delete retrievedUserDetailsObj.modifiedOn;
            resolve(retrievedUserDetailsObj);
          } else {
            logger.info(
              "Login Failed Due To Invalid Password",
              "userController: validatePassword()",
              10
            );
            let apiResponse = response.generate(
              true,
              "Wrong Password.Login Failed",
              400,
              null
            );
            reject(apiResponse);
          }
        }
      );
    });
  };

  let generateToken = (userDetails) => {
    console.log("generate token");
    return new Promise((resolve, reject) => {
      token.generateToken(userDetails, (err, tokenDetails) => {
        if (err) {
          console.log(err);
          let apiResponse = response.generate(
            true,
            "Failed To Generate Token",
            500,
            null
          );
          reject(apiResponse);
        } else {
          tokenDetails.userId = userDetails.userId;
          tokenDetails.userDetails = userDetails;
          resolve(tokenDetails);
        }
      });
    });
  };

  findUser(req, res)
    .then(validatePassword)
    .then(generateToken)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "Login Successful",
        200,
        resolve
      );
      res.status(200);
      res.send(apiResponse);
    })
    .catch((err) => {
      console.log("errorhandler");
      console.log(err);
      res.status(err.status);
      res.send(err);
    });
};

let logout = (req, res) => {
  AuthModel.findOneAndRemove({ userId: req.user.userId }, (err, result) => {
    if (err) {
      console.log(err);
      logger.error(err.message, "userController: logout", 10);
      let apiResponse = response.generate(
        true,
        `error occurred: ${err.message}`,
        500,
        null
      );
      res.send(apiResponse);
    } else if (check.isEmpty(result)) {
      let apiResponse = response.generate(
        true,
        "Already logged-out or userId not valid",
        404,
        null
      );
      res.send(apiResponse);
    } else {
      let apiResponse = response.generate(
        false,
        "Successfully logged-out",
        200,
        null
      );
      res.send(apiResponse);
    }
  });
};

let forgotPassword = (req, res) => {
  let createTransporter = () => {
    return new Promise((resolve, reject) => {
      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "acctest.sdev@gmail.com", // generated ethereal user
          pass: "acc@test", // generated ethereal password
        },
      });
      resolve(transporter);
    });
  };

  let sendEmail = (transporter) => {
    return new Promise((resolve, reject) => {
      let info = transporter.sendMail({
        from: "", // sender address
        to: req.body.emailId, // list of receivers
        subject: "Todo List| Forgot Password Support", // Subject line
        text: "Forgot password code", // plain text body
        html: `<b>Forgot Password Link</b>
        <p>Click <a href = "" alt = "">here</a> to change your password.</p>
        <p>Thanks<br>Support Team</p>
        `, // html body
      });

      if (check.isEmpty(info.messageId)) {
        let apiResponse = response.generate(
          true,
          "Error while processing request",
          500,
          null
        );
        reject(apiResponse);
      } else {
        let apiResponse = response.generate(
          false,
          "Forgot password request processed",
          200,
          {
            message:
              "Forgot password request processed succesfully. Please check your email for further steps.",
          }
        );
        resolve(apiResponse);
      }
    });
  };

  createTransporter(req, res)
    .then(sendEmail)
    .then((resolve) => {
      res.status(200);
      res.send(resolve);
    })
    .catch((err) => {
      console.log("errorhandler");
      console.log(err);
      res.status(err.status);
      res.send(err);
    });
};

let userFriendList = (req, res) => {
  let validateUserInput = () => {
    return new Promise((resolve, reject) => {
      if (req.params.userId) {
        resolve(req);
      } else {
        logger.error(
          "Field missing error during user friend list",
          "userController: userFriendList()",
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

  let userFriendList = () => {
    return new Promise((resolve, reject) => {
      UserFriendModel.find({ userId: req.params.userId })
        .select("-__v -_id") //Hide the information which need not to send in response
        .lean() //Return plain javascript object instead of mongoose object on which we can perform function
        .exec((err, result) => {
          if (err) {
            logger.error(err.message, "userController:userFriendList", 10);
            let apiResponse = response.generate(
              true,
              "Failed to find user friend data",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(result)) {
            logger.info(
              "No User friend found",
              "userController:userFriendList",
              5
            );
            let apiResponse = response.generate(
              true,
              "No User friend found",
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

  validateUserInput(req, res)
    .then(userFriendList)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "User Friend List found",
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

let userList = (req, res) => {
  UserModel.find()
    .select("-__v -_id") //Hide the information which need not to send in response
    .lean() //Return plain javascript object instead of mongoose object on which we can perform function
    .exec((err, result) => {
      if (err) {
        logger.error(err.message, "User Controller:userList", 10);
        let apiResponse = response.generate(
          true,
          "Failed to find user data",
          500,
          null
        );
        res.send(apiResponse);
      } else if (check.isEmpty(result)) {
        logger.info("No blog found", "User Controller:userList", 5);
        let apiResponse = response.generate(true, "No user found", 404, null);
        res.send(apiResponse);
      } else {
        let apiResponse = response.generate(
          false,
          "All User data found",
          200,
          result
        );
        res.send(apiResponse);
      }
    });
};

let sendRequest = (req, res) => {
  let validateUserInput = () => {
    return new Promise((resolve, reject) => {
      if (req.params.userId) {
        if (check.isEmpty(req.body.userId)) {
          let apiResponse = response.generate(
            true,
            "Friend User id is not valid",
            400,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(req.body.firstName)) {
          let apiResponse = response.generate(
            true,
            "Friend first name is not valid",
            400,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(req.body.lastName)) {
          let apiResponse = response.generate(
            true,
            "Friend last name is not valid",
            400,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(req.body.email)) {
          let apiResponse = response.generate(
            true,
            "Friend email id is not valid",
            400,
            null
          );
          reject(apiResponse);
        } else {
          resolve(req);
        }
      } else {
        logger.error(
          "Field missing error during user friend list",
          "userController: userFriendList()",
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

  let requestNewFriendItem = () => {
    return new Promise((resolve, reject) => {
      let newFriend = new UserFriendModel({
        friendId: shortid.generate(),
        userId: req.body.userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        requestApproved: false,
        createdOn: time.now(),
      });

      newFriend.save((err, friendItem) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "userController: requestNewFriendItem", 10);
          let apiResponse = response.generate(
            true,
            "Failed to request friend",
            500,
            null
          );
          reject(apiResponse);
        } else {
          let newFriendObj = friendItem.toObject();
          resolve(newFriendObj);
        }
      });
    });
  };

  validateUserInput(req, res)
    .then(requestNewFriendItem)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "Friend requested successfully",
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

let acceptRequest = (req, res) => {
  let validateUserInput = () => {
    return new Promise((resolve, reject) => {
      if (req.params.userId) {
        if (req.params.friendId) {
          resolve(req);
        } else {
          logger.error(
            "Field missing error during accept friend request",
            "userController: acceptRequest()",
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
          "Field missing error during accept friend request",
          "userController: acceptRequest()",
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

  let acceptFriendRequest = () => {
    return new Promise((resolve, reject) => {
      let options = {
        requestApproved: true,
      };

      UserFriendModel.update({ friendId: req.params.friendId }, options, {
        multi: true,
      }).exec((req, result) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "userController: acceptFriendRequest", 10);
          let apiResponse = response.generate(
            true,
            "Failed to accept request",
            500,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(result)) {
          logger.error(err.message, "userController: acceptFriendRequest", 10);
          let apiResponse = response.generate(
            true,
            "User not found",
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

  validateUserInput(req, res)
    .then(acceptFriendRequest)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "Friend Request accepted",
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

let updatePassword = (req, res) => {};

module.exports = {
  userSignUp: userSignUp,
  userLogin: userLogin,
  logout: logout,
  forgotPassword: forgotPassword,
  userFriendList: userFriendList,
  userList: userList,
  sendRequest: sendRequest,
  acceptRequest: acceptRequest,
  updatePassword: updatePassword,
};
