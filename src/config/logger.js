const winston = require('winston');
const {format} = winston;
const config = require('./config');

const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json(),        
    ),    
    transports: [    
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),        
    ],
});

if (config.ENV === 'dev') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

module.exports = logger
