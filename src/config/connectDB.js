const mongoose = require('mongoose');
const logger = require('./logger');
const config = require('./config');

const connectDB = async (MONGO_URI = config.MONGO_URI) => {
  let conn;
	try {
		conn = await mongoose.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		logger.info(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		logger.info(error);
		process.exit(1);
	}

  return conn;
};

module.exports = connectDB;
