const Joi = require('joi');
const config = require('../config/config');
const { ADMIN, BOSS, REGULAR_USER } = require(`../entities/roles`);
const mongoId = require('./idSchemas');


const roleField = {
	role: Joi.string()
		.valid(ADMIN, BOSS, REGULAR_USER)
		.required(),
}

const joiPassword = Joi.string()
	.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
	.required()
	.messages({
		'string.pattern.base': 'Passwords must contain: ' +
			'a minimum 1 lower case letter \[a-z\], ' +
			'a minimum 1 upper case letter \[A-Z\], ' +
			'a minimum 1 numeric character \[0-9\] and ' +
			'must be at least 8 characters long.',
	});

const roleSchema = Joi.object({
	...roleField,
});

const userRegSchema = Joi.object({
	email: Joi.string()
		.trim()
		.email()
		.required(),

	password: joiPassword,
});

module.exports = {roleSchema, userRegSchema}
