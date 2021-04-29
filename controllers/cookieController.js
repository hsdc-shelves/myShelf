const cookieParser = require('cookie-parser');
const { User } = require('../models/mainModels');

const cookieController = {};

cookieController.setSSIDCookie = (req, res, next) => {
//Sets an SSID cookie for the user, only if their login/signup is verified.
  if (!res.locals.userVerified) return next();

  res.locals.ssid = res.locals.user._id;
  res.cookie('ssid', res.locals.user._id, { httpOnly: true });
  return next();
};

module.exports = cookieController;