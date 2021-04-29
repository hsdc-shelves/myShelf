const { Session, User } = require('../models/mainModels');

const sessionController = {};

sessionController.createSession = async (req, res, next) => {
//Creates a user session in the db, only if user login/signup is verified.
  if (!res.locals.userVerified) return next();
  
  try {
    const session = await Session.create({ cookieId: res.locals.user._id });
    console.log('New session created: ', session);
    res.locals.sessionAuthenticated = true;
  } catch (err) {
    return next({log: `Could not create session in db: ${err}`})
  }
  return next();
};


// middleware to check if user is already in an active session
sessionController.isLoggedIn = async (req, res, next) => {
//Check if a user has an active session (via ssid cookie on request)

  console.log(`Checking session based on ssid cookie: ${req.cookies.ssid}`);

  //ssid cookie not present; user is considered not verified
  if (!req.cookies.ssid) {
    res.locals.userVerified = false;
    return next();
  }

  try {
    const session = await Session.findOne({cookieId: req.cookies.ssid }).exec();
    
    if (!session) { //No active session found
      res.locals.userVerified = false;
    } else { //Active session found
      res.locals.userVerified = true;
      console.log('User session is authenticated.');
    }
  } catch (err) {
    //Don't throw an error; do not block user from accessing app at all due to db error
    res.locals.userVerified = false; 
  }

  return next();
};

module.exports = sessionController;