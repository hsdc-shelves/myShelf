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
    const passwordMatches = bcrypt.compare(
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



// userController.verifyUser = async (req, res, next) => {

//   console.log('Login received: ', req.body);
//   const { username, password } = req.body;

//   console.log(`username and password:`, username, password);
//   // only query userName; check out bcrypt docs to see how to compare input password and encrypted password
//   try {
//     //Login received:  { username: 'a', password: 'a' }
//     const foundUser = await User.findOne({ 'userProfile.username' : username }).exec();
//     console.log('found user: ', foundUser);
//     if (foundUser !== null) {
//       bcrypt.compare(password, foundUser.userProfile.password, (err, response) => {
//         if (err) return next(err);
//         if (response) {
//           console.log(`User ${username} verified!`);
//           res.locals.user = foundUser;
//           return next();
//         }
//       });
//     } else {
//       res.locals.notFound = true;
//       return next();
//     }
//   } catch (error) {
//     console.log(error.stack);
//     return next(error);
//   }
// }

module.exports = userController;