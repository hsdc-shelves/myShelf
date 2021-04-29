const { User } = require('../models/mainModels');
const bcrypt = require('bcrypt');

const userController = {};

userController.createUserDocument = async (req, res, next) => {
//Create a new user document, provided via request body

  console.log('Creating new user: ', req.body);
  try {
    const newUser = await User.create({userProfile: req.body});
    res.locals.user = newUser;
    res.locals.userVerified = true;
    console.log('Document created: ', newUser);
  } catch (err) {
    return next({log: `Could not create new user document: ${err}`});
  }
  
  return next();
};

userController.getUserDocumentByUsername = async (req, res, next) => {
//Retrieves a user document based on a username provided via the request body for login

  console.log(`Retrieving user document for username: ${req.body.username}`);

  try {
    const user = await User.findOne({'userProfile.username': req.body.username}).exec();
    if (!user) {
      res.locals.userVerified = false;
    }
    res.locals.user = user;
  } catch (err) {
    return next({log: `Could not query for user document: ${err}`})
  }

  
  return next();
}

userController.getUserDocumentBySSIDCookie = async (req, res, next) => {
//Retrieves a user document based on ssid cookie

  console.log(`Retrieving user document for userId: ${req.cookies.ssid}`);
  if (!req.cookies.ssid) return next();

  try {
    const user = await User.findOne({ _id: req.cookies.id}).exec();
    res.locals.user = user;
  } catch (err) {
    next({log: `Could not query for user: ${err}`});
  }
  
  return next();
}

userController.verifyPassword = async (req, res, next) => {
//Verifies whether login attempt's password is correct 

  try {
    const passwordMatches = await bcrypt.compare(
      req.body.password, 
      res.locals.user.userProfile.password
      );

    if (!passwordMatches) {
      res.locals.userVerified = false;
    } else {
      res.locals.userVerified = true;
    }
  } catch (err) {
    return next({log: `Could not compare passwords: ${err}`});
  }

  return next();
}

userController.constructUserData = async (req, res, next) => {
//Assemble user data for response to client. 
//Indicates if user is authenticated, and if so, provide their userProfile

  //Construct user profile if we have access to the user document
  let userProfile;
  if (res.locals.userVerified) {
    userProfile = {
      ...res.locals.user.userProfile,
      _id: res.locals.user._id
    }
  } else {
    userProfile = {}
  }

  res.locals.payload = {
    verified: res.locals.userVerified,
    userProfile: userProfile
  }

  return next();
};

module.exports = userController;