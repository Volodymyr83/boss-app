const config = {
    PORT: process.env.PORT || 8080,
    ENV: process.env.NODE_ENV || 'dev',   
    JWT_SECRET: process.env.JWT_SECRET || 'topsecret',
    MONGO_URI: process.env.MONGO_URI,    
}

module.exports = config
