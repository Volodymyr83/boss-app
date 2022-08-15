const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { requestValidator } = require('../middleware/requestValidator');
const { idSchema, bossIdSchema } = require('../validators/idSchemas');
const { authorize } = require('../middleware/auth');
const { getUsers, changeBoss } = require('../services/usersService');
const {ADMIN, BOSS, REGULAR_USER} = require('../entities/roles');

// @desc   Return list of users
// @route  GET /api/users
router.get('/',
  authorize([ADMIN, BOSS, REGULAR_USER]),
  asyncHandler(
    async (req, res) => {      
      const users = await getUsers(req.user);      

      res.json(users);
    }
  )
);

// @desc   Change boss for user
// @route  PUT /api/users/:id/change-boss
router.put('/:id/change-boss',
  authorize([ADMIN, BOSS]),
  requestValidator(bossIdSchema, 'body'),
  requestValidator(idSchema, 'params'),
  asyncHandler(    
    async (req, res) => {      
      const {id: user_id} = req.params;
      const {new_boss_id} = req.body;
      const {subordinate_user, new_boss, old_boss} = await changeBoss(user_id, new_boss_id, req.user);      

      res.json({subordinate_user, new_boss, old_boss});
    }
  )
);

module.exports = router;