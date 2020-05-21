const bcrypt = require("bcrypt");
const saltRounds = 12;

let logger = require("../libs/loggerLib");

let hashpassword = (plaintextPassword) => {
  let salt = bcrypt.genSaltSync(saltRounds);
  let hash = bcrypt.hashSync(plaintextPassword, salt);
  return hash;
};

let comparePassword = (oldPassword, hashpassword, cb) => {
  bcrypt.compare(oldPassword, hashpassword, (err, res) => {
    if (err) {
      logger.error(err.message, "Password comparision error", 5);
      cb(err, null);
    } else {
      cb(null, res);
    }
  });
};

let comparePasswordSync = (plaintextPassword, hash) => {
  return bcrypt.compareSync(plaintextPassword, hash);
};

module.exports = {
  hashpassword: hashpassword,
  comparePassword: comparePassword,
  comparePasswordSync: comparePasswordSync,
};
