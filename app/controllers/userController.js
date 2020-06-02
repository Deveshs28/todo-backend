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

const requestPromise = require("request-promise");

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
              firstName: req.body.firstName || "",
              lastName: req.body.lastName || "",
              email: req.body.email.toLowerCase(),
              mobileNumber: req.body.mobileNumber,
              countryCode: req.body.countryCode || 0,
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

  let saveToken = (tokenDetails) => {
    return new Promise((resolve, reject) => {
      AuthModel.findOne(
        { userId: tokenDetails.userId },
        (err, retrievedTokenDetails) => {
          if (err) {
            console.log(err.message, "user Controller: saveToken", 10);
            let apiResponse = response.generate(
              true,
              "Failed to generate token",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(retrievedTokenDetails)) {
            let newAuthToken = new AuthModel({
              userId: tokenDetails.userId,
              authToken: tokenDetails.token,
              tokenSecret: tokenDetails.tokenSecret,
              tokenGenerationTime: time.now(),
            });
            newAuthToken.save((err, newTokenDetails) => {
              if (err) {
                console.log(err);
                logger.error(err.message, "user Controller: saveToken", 10);
                let apiResponse = response.generate(
                  true,
                  "Failed to generate token",
                  500,
                  null
                );
                reject(apiResponse);
              } else {
                let responseBody = {
                  authToken: newTokenDetails.authToken,
                  userDetails: tokenDetails.userDetails,
                };
                resolve(responseBody);
              }
            });
          } else {
            retrievedTokenDetails.authToken = tokenDetails.token;
            retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret;
            retrievedTokenDetails.tokenGenerationTime = time.now();
            retrievedTokenDetails.save((err, newTokenDetails) => {
              if (err) {
                console.log(err);
                logger.error(err.message, "user Controller: saveToken", 10);
                let apiResponse = response.generate(
                  true,
                  "Failed to generate token",
                  500,
                  null
                );
                reject(apiResponse);
              } else {
                let responseBody = {
                  authToken: newTokenDetails.authToken,
                  userDetails: tokenDetails.userDetails,
                };
                resolve(responseBody);
              }
            });
          }
        }
      );
    });
  };

  findUser(req, res)
    .then(validatePassword)
    .then(generateToken)
    .then(saveToken)
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
  let validateInput = () => {
    console.log("findUser");
    return new Promise((resolve, reject) => {
      if (req.params.userId) {
        resolve(req);
      } else {
        logger.error(
          "User Id not available during logout operation",
          "userController: validateInput()",
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

  let removeAuthToken = () => {
    return new Promise((resolve, reject) => {
      AuthModel.findOneAndRemove(
        { userId: req.params.userId },
        (err, result) => {
          if (err) {
            logger.error(err.message, "userController: logout", 10);
            let apiResponse = response.generate(
              true,
              `error occurred: ${err.message}`,
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(
              true,
              "Already logged-out or userId not valid",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "Successfully logged-out",
              200,
              null
            );
            resolve(apiResponse);
          }
        }
      );
    });
  };

  let clearNotificationToken = () => {
    return new Promise((resolve, reject) => {
      let options = {
        notificationToken: "",
      };

      UserModel.update({ userId: req.params.userId }, options, {
        multi: true,
      }).exec((err, result) => {
        if (err) {
          logger.error(err.message, "userController: logout", 10);
          let apiResponse = response.generate(
            true,
            `error occurred: ${err.message}`,
            500,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(result)) {
          let apiResponse = response.generate(
            true,
            "Already logged-out or userId not valid",
            404,
            null
          );
          reject(apiResponse);
        } else {
          let apiResponse = response.generate(
            false,
            "Successfully logged-out",
            200,
            null
          );
          resolve(apiResponse);
        }
      });
    });
  };

  validateInput(req, res)
    .then(removeAuthToken)
    .then(clearNotificationToken)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "User Logout Succesfully",
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

let forgotPassword = (req, res) => {
  let createTransporter = () => {
    return new Promise((resolve, reject) => {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        // host: "smtp.ethereal.email",
        // port: 587,
        // secure: false, // true for 465, false for other ports
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
      UserModel.findOne({ email: req.body.email })
        .lean()
        .exec((err, retrievedUserDetails) => {
          if (err) {
            logger.error(err.message, "userController: forgotPassword", 10);
            let apiResponse = response.generate(
              true,
              `error occurred: ${err.message}`,
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(retrievedUserDetails)) {
            logger.error(err.message, "userController: forgotPassword", 10);
            let apiResponse = response.generate(
              true,
              "User Not Found",
              404,
              null
            );
            reject(apiResponse);
          } else {
            const mailOptions = {
              from: "acctest.sdev@gmail.com",
              to: req.body.email,
              subject: "Todo List| Forgot Password Support",
              text: "Forgot password link", // plain text body
              html:
                '<b>Forgot your password </b><br><p>Click <a href="http://localhost:4200/updatePassword/' +
                retrievedUserDetails.userId +
                '">here</a> to change your password</p><br><p>Thanks<br>Support Team</p>',
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
                let apiResponse = response.generate(
                  true,
                  "Error while processing request",
                  500,
                  error
                );
                reject(apiResponse);
              } else {
                console.log("Email sent: " + info.response);
                let apiResponse = response.generate(
                  false,
                  "Forgot password request processed",
                  200,
                  {
                    message:
                      "Forgot password request processed succesfully. Please check your email inbox or spam folder for further steps.",
                  }
                );
                resolve(apiResponse);
              }
            });
          }
        });
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
        if (req.params.page) {
          if (req.params.recordCount) {
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
      let pageNumber = parseInt(req.params.page);
      let recordCount = parseInt(req.params.recordCount);

      UserFriendModel.find({
        $or: [
          { senderId: req.params.userId },
          { receiverId: req.params.userId },
        ],
      })
        .skip(pageNumber > 0 ? (pageNumber - 1) * recordCount : 0)
        .limit(recordCount)
        .sort("-createdOn")
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
  let validateInput = () => {
    return new Promise((resolve, reject) => {
      if (req.params.userId) {
        if (req.params.page) {
          if (req.params.recordCount) {
            resolve(req);
          } else {
            logger.error(
              "Field missing error during user list",
              "userController: userList()",
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
            "Field missing error during user list",
            "userController: userList()",
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
          "Field missing error during user list",
          "userController: userList()",
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
      UserFriendModel.find({
        $or: [
          { senderId: req.params.userId },
          { receiverId: req.params.userId },
        ],
      })
        .sort("-createdOn")
        .select("-__v -_id") //Hide the information which need not to send in response
        .lean() //Return plain javascript object instead of mongoose object on which we can perform function
        .exec((err, result) => {
          let emptyResponse = [];
          if (err) {
            resolve(emptyResponse);
          } else if (check.isEmpty(result)) {
            resolve(emptyResponse);
          } else {
            resolve(result);
          }
        });
    });
  };
  let userList = (userFriendModel) => {
    return new Promise((resolve, reject) => {
      let pageNumber = parseInt(req.params.page);
      let recordCount = parseInt(req.params.recordCount);

      UserModel.find()
        .skip(pageNumber > 0 ? (pageNumber - 1) * recordCount : 0)
        .limit(recordCount)
        .select("-__v -_id -password -createdOn") //Hide the information which need not to send in response
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
            reject(apiResponse);
          } else if (check.isEmpty(result)) {
            logger.info("No User found", "User Controller:userList", 5);
            let apiResponse = response.generate(
              true,
              "No user found",
              204,
              null
            );
            reject(apiResponse);
          } else {
            var friendIdModel = [];
            if (userFriendModel.length > 0) {
              for (let friendModel of userFriendModel) {
                friendIdModel.push(friendModel.senderId);
                friendIdModel.push(friendModel.receiverId);
              }
            }
            var respObj = [];
            for (let user of result) {
              if (friendIdModel.length > 0) {
                if (!friendIdModel.includes(user.userId)) {
                  if (user.userId !== req.params.userId) {
                    respObj.push(user);
                  }
                }
              } else {
                if (user.userId !== req.params.userId) {
                  respObj.push(user);
                }
              }
            }
            if (respObj.length > 0) {
              resolve(respObj);
            } else {
              logger.info("No User found", "User Controller:userList", 5);
              let apiResponse = response.generate(
                true,
                "No user found",
                204,
                null
              );
              reject(apiResponse);
            }
          }
        });
    });
  };

  validateInput(req, res)
    .then(userFriendList)
    .then(userList)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "All User data found",
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

let sendRequest = (req, res) => {
  let validateUserInput = () => {
    return new Promise((resolve, reject) => {
      if (check.isEmpty(req.body.senderId)) {
        let apiResponse = response.generate(
          true,
          "Sender id is not valid",
          400,
          null
        );
        reject(apiResponse);
      } else if (check.isEmpty(req.body.receiverId)) {
        let apiResponse = response.generate(
          true,
          "Reciever id is not valid",
          400,
          null
        );
        reject(apiResponse);
      } else if (check.isEmpty(req.body.senderName)) {
        let apiResponse = response.generate(
          true,
          "Sender name is not valid",
          400,
          null
        );
        reject(apiResponse);
      } else if (check.isEmpty(req.body.receiverName)) {
        let apiResponse = response.generate(
          true,
          "Receiver name is not valid",
          400,
          null
        );
        reject(apiResponse);
      } else {
        resolve(req);
      }
    });
  };

  let requestNewFriendItem = () => {
    return new Promise((resolve, reject) => {
      let newFriend = new UserFriendModel({
        requestId: shortid.generate(),
        senderId: req.body.senderId,
        receiverId: req.body.receiverId,
        senderName: req.body.senderName,
        receiverName: req.body.receiverName,
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

  let sendNotification = () => {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ userId: req.body.receiverId }).exec((err, result) => {
        if (!check.isEmpty(result)) {
          if (!check.isEmpty(result.notificationToken)) {
            const bodyContent = {
              notification: {
                title: `Friend Request From: ${req.body.senderName}`,
                body: `${req.body.senderName} sent you friend request.`,
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
      });
    });
  };

  validateUserInput(req, res)
    .then(requestNewFriendItem)
    .then(sendNotification)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "Friend requested successfully",
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

let acceptRequest = (req, res) => {
  let validateUserInput = () => {
    return new Promise((resolve, reject) => {
      if (req.params.requestId) {
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
    });
  };

  let acceptFriendRequest = () => {
    return new Promise((resolve, reject) => {
      let options = {
        requestApproved: true,
      };

      UserFriendModel.update({ requestId: req.params.requestId }, options, {
        multi: true,
      }).exec((err, result) => {
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

  let sendNotification = (userFriendModel) => {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ userId: resolve.senderId }).exec((err, result) => {
        if (!check.isEmpty(result)) {
          if (!check.isEmpty(result.notificationToken)) {
            const bodyContent = {
              notification: {
                title: `Friend Request Accepted`,
                body: `${userFriendModel.receiverName} accepted your friend request.`,
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
      });
    });
  };

  validateUserInput(req, res)
    .then(acceptFriendRequest)
    .then(sendNotification)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "Friend Request accepted",
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

let updatePassword = (req, res) => {
  let validateInput = () => {
    return new Promise((resolve, reject) => {
      if (req.params.userId) {
        if (check.isEmpty(req.body.password)) {
          logger.error(
            "Field missing error during update password",
            "userController: updatePassword()",
            5
          );
          let apiResponse = response.generate(
            true,
            "One or More Body Parameter(s) is missing",
            400,
            null
          );
          reject(apiResponse);
        } else {
          resolve(req);
        }
      } else {
        logger.error(
          "Field missing error during update password",
          "userController: updatePassword()",
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

  let updateUserPassword = () => {
    return new Promise((resolve, reject) => {
      let options = {
        password: passwordLib.hashpassword(req.body.password),
      };

      UserModel.update({ userId: req.params.userId }, options, {
        multi: true,
      }).exec((err, result) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "userController: updateUserPassword", 10);
          let apiResponse = response.generate(
            true,
            "Failed to update password",
            500,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(result)) {
          logger.error(err.message, "userController: updateUserPassword", 10);
          let apiResponse = response.generate(
            true,
            "User not found",
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
    .then(updateUserPassword)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "User password updated",
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

let registerPushNotification = (req, res) => {
  let validateInput = () => {
    return new Promise((resolve, reject) => {
      if (req.params.userId) {
        if (check.isEmpty(req.body.notificationToken)) {
          logger.error(
            "Field missing error during push notification registration",
            "userController: registerPushNotification()",
            5
          );
          let apiResponse = response.generate(
            true,
            "One or More Body Parameter(s) is missing",
            400,
            null
          );
          reject(apiResponse);
        } else {
          resolve(req);
        }
      } else {
        logger.error(
          "Field missing error during update password",
          "userController: registerPushNotification()",
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

  let pushNotificationRegistration = () => {
    return new Promise((resolve, reject) => {
      let options = req.body;

      UserModel.update({ userId: req.params.userId }, options, {
        multi: true,
      }).exec((err, result) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "userController: updateUserPassword", 10);
          let apiResponse = response.generate(
            true,
            "Failed to update password",
            500,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(result)) {
          logger.error(err.message, "userController: updateUserPassword", 10);
          let apiResponse = response.generate(
            true,
            "User not found",
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
    .then(pushNotificationRegistration)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "User successfully registered for push notification",
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
  userSignUp: userSignUp,
  userLogin: userLogin,
  logout: logout,
  forgotPassword: forgotPassword,
  userFriendList: userFriendList,
  userList: userList,
  sendRequest: sendRequest,
  acceptRequest: acceptRequest,
  updatePassword: updatePassword,
  registerPushNotification: registerPushNotification,
};
