const User = require('../models/User');
const ApiError = require('../models/ApiError');
const bcrypt = require('bcrypt');

const loginAttempt = async (loginData) => {
  const { email, password } = loginData;

  const userValid = await User.findOne({ email });

  if (!userValid) {
    throw ApiError.badRequest(`User with email: ${email} does not exist`);
  }
  const result = await bcrypt.compare(password, userValid.password);

  if (!result) {
    throw ApiError.badRequest(`Password ${password} is incorrect`);
  }
      
  return userValid;
}

module.exports = { loginAttempt };