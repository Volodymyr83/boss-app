const Joi = require('joi');

const mongoId = () => Joi.string()
	.hex()
	.length(24)
	.messages({
		'string.hex': '{{#label}} must be a hexadecimal number',
		'string.length': '{{#label}} must be 24 characters long',
});

const idSchema = Joi.object({
	id: mongoId()
		.required(),
});

const bossIdSchema = Joi.object({
	new_boss_id: mongoId()
		.required(),
});

module.exports = { idSchema, bossIdSchema };