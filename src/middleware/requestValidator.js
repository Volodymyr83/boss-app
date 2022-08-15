const Joi = require('joi');

const requestValidator = (schema, property) => { 
  return (req, res, next) => {
    req[property] = Joi.attempt(req[property], schema);
    next();
  } 
}

module.exports = {requestValidator};
