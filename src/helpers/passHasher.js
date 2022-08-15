const bcrypt = require('bcrypt');

const saltRounds = 7;
const salt = bcrypt.genSaltSync(saltRounds);

module.exports = async password => {
  return bcrypt.hash(password, salt);
};
