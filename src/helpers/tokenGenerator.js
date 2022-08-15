const config = require('../config/config');
const jwt = require(`jsonwebtoken`);
const { msInDay } = require('../entities/time');

const generateToken = (_id, email, role) => {
	return jwt.sign({ _id, email, role }, config.JWT_SECRET, {
		expiresIn: msInDay/1000,
	});
};

module.exports = {generateToken};