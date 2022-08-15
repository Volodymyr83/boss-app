const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { loginAttempt } = require('../services/loginService');
const { generateToken } = require('../helpers/tokenGenerator');
const {msInDay} = require('../entities/time');
const { requestValidator } = require('../middleware/requestValidator');
const { userRegSchema } = require(`../validators/userSchemas`);


// @desc  Login user
// @route POST /api/login
router.post(
  '/',
  requestValidator(userRegSchema, 'body'),
  asyncHandler(async (req, res) => {
    const { _id, email, role } = await loginAttempt(req.body);
    const jwtToken = generateToken(_id, email, role);

    res.cookie('jwtToken', jwtToken, {maxAge: 30 * msInDay, httpOnly: true})
      .json({_id, email, role});
  })
);

module.exports = router;
