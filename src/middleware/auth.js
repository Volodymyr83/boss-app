const ApiError = require('../models/ApiError');
const jwt = require(`jsonwebtoken`);
const config = require('../config/config');

const tokenParser = (req) => {  
  const cookies = req.cookies;  
  
  if (!cookies?.jwtToken) {
    throw new ApiError(401, `Unauthorized request. Missing token`);
  }

  try {
    req.user = jwt.verify(cookies.jwtToken, config.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, `Unauthorized request. Bad token!`);
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    tokenParser(req);
    
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(401, 'Unauthorized request. Bad token');
    }
      
    next();  
  }
}

module.exports = {authorize};