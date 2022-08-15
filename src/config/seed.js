require('dotenv').config();
const connectDB = require('./connectDB');
const User = require('../models/User');
const {ADMIN} = require('../entities/roles');
const logger = require('./logger');
const {checkAndFormatUserData, createUser} = require('../services/registrationService');


(async () => {
  await connectDB();

  const administrator = new User({
    email: 'admin@gmail.com',
    password: 'Admin123',
    role: ADMIN,
  });

  let admin = await User.findOne({email: administrator.email});

  if(!admin) {
    admin = await User.create(administrator);
    logger.info('Administrator was created in the data base');    
  } else {
    logger.info('Administrator already exists in the data base');
  }

  const usersCredentials = [
    {email: 'Masha@gmail.com', password: 'Aa123456'},
    {email: 'Dasha@gmail.com', password: 'Aa123456'},
    {email: 'Lara@gmail.com', password: 'Aa123456'},
    {email: 'Misha@gmail.com', password: 'Aa123456'},
    {email: 'Maria@gmail.com', password: 'Aa123456'},
    {email: 'Oleg@gmail.com', password: 'Aa123456'},
    {email: 'Olha@gmail.com', password: 'Aa123456'},
    {email: 'Maryna@gmail.com', password: 'Aa123456'},
    {email: 'Vitaliy@gmail.com', password: 'Aa123456'},
    {email: 'Anton@gmail.com', password: 'Aa123456'},
    {email: 'Ira@gmail.com', password: 'Aa123456'},
    {email: 'Nadiya@gmail.com', password: 'Aa123456'},
    // {email: 'Kolia@gmail.com', password: 'Aa123456'},
    // {email: 'Rita@gmail.com', password: 'Aa123456'},
    // {email: 'Myroslava@gmail.com', password: 'Aa123456'},
    // {email: 'Radion@gmail.com', password: 'Aa123456'},
    // {email: 'Filip@gmail.com', password: 'Aa123456'},
    // {email: 'Svitlana@gmail.com', password: 'Aa123456'},
    // {email: 'Volodymyr@gmail.com', password: 'Aa123456'},
    // {email: 'Borys@gmail.com', password: 'Aa123456'},
    // {email: 'Ivan@gmail.com', password: 'Aa123456'},
    // {email: 'Kyrylo@gmail.com', password: 'Aa123456'},
    // {email: 'Oleksandr@gmail.com', password: 'Aa123456'},
    // {email: 'Tetiana@gmail.com', password: 'Aa123456'},
    // {email: 'Serhiy@gmail.com', password: 'Aa123456'},
    // {email: 'Ernest@gmail.com', password: 'Aa123456'},
    // {email: 'Mykola@gmail.com', password: 'Aa123456'},
    // {email: 'Petro@gmail.com', password: 'Aa123456'},
    // {email: 'Dmytro@gmail.com', password: 'Aa123456'},
    // {email: 'Mike@gmail.com', password: 'Aa123456'},
    // {email: 'Danylo@gmail.com', password: 'Aa123456'},
    // {email: 'Roman@gmail.com', password: 'Aa123456'},    
  ];
  
  try {
    const usersDTOs = await Promise.all(usersCredentials.map( async (item)  => await checkAndFormatUserData(item)));
    
    for (const user of usersDTOs) {
      await createUser(user);
      logger.info(`User ${user.email} was created in the data base`)
    }
  } catch (error) {
    
  }
  
  process.exit(1);
})();

