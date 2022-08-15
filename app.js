require('dotenv').config();
const config = require('./src/config/config');
const connectDB = require('./src/config/connectDB');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const ErrorHandler = require('./src/middleware/errorHandler');
const cors = require('./src/middleware/cors');
const logger = require('./src/config/logger');

connectDB();

const app = express();

// CORS
app.use(cors);

// Parsers
app.use(express.json());
app.use(cookieParser());

// Logging
if (config.ENV === 'dev') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/register', require('./src/routes/registrationRouter'));
app.use('/api/login', require('./src/routes/loginRouter'));
app.use('/api/logout', require('./src/routes/logoutRouter'));
app.use('/api/users', require('./src/routes/usersRouter'));

// Error handler
app.use(ErrorHandler);

module.exports = app;

const port = config.PORT;

app.listen(port, (req, res) => {
  logger.info(`
    ################################################
          Server is listening on port: ${port}
    ################################################
  `);
}).on('error', (err) => {
  logger.error(err);
  process.exit(1);
});