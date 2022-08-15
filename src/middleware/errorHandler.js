const ApiError = require('../models/ApiError');
const logger = require('../config/logger');
const Joi = require('joi');

function ErrorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    logger.info(err.message);
    res.status(err.code).json(err.message);
    return;
  }

  if (Joi.isError(err)) {    
    logger.info(err.details);
    res.status(400).json(
      ...err.details.map(detail => detail.message)
    );
    return;
  }

  logger.error(err);
  console.log(err)
  res.status(500).json(`Server error: ${err}`);
}
module.exports = ErrorHandler;
