const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { requestValidator } = require('../middleware/requestValidator');
const { generateToken } = require('../helpers/tokenGenerator');
const { msInDay } = require('../entities/time');
const { userRegSchema } = require(`../validators/userSchemas`);
const { checkAndFormatUserData, createUser } = require('../services/registrationService');


// @desc   Register user
// @route  POST /api/registration
router.post('/',
  requestValidator(userRegSchema, 'body'),
  asyncHandler(
    async (req, res) => {
      const userDTO = await checkAndFormatUserData(req.body);
      const { _id, email, role } = await createUser(userDTO);
      const jwtToken = generateToken(_id, email, role);

      res.cookie('jwtToken', jwtToken, { maxAge: msInDay, httpOnly: true })
        .json({ _id, email, role });
    }
  )
);

module.exports = router;
