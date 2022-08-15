const express = require('express');
const router = express.Router();


// @desc  Logout user
// @route POST /api/logout
router.post('/', (req, res) => {
    res.cookie('jwtToken', '', {maxAge: 0, httpOnly: true})
    .json({message: 'Success'})
});

module.exports = router;