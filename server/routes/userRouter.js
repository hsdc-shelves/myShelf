const express = require('express');
const router = express.Router();

const userController = require('../../controllers/userController');
const sessionController = require('../../controllers/sessionController');
const cookieController = require('../../controllers/cookieController');

// checks for valid session cookie -- is the user already in an active session?
router.get(
  '/',
  sessionController.isLoggedIn,
  sessionController.servePage,
  (req, res) => {
    // json stringified response of sessionAuthenticated cookie
    res.status(200).json(res.locals.payload);
  }
);

// create user
router.post(
  '/create',
  userController.createUser,
  cookieController.setSSIDCookie,
  sessionController.createSession,
  sessionController.servePage,
  (req, res) => {
    res.status(200).json(res.locals.payload);
  }
);

// user login
router.post(
  '/login',
  userController.verifyUser,
  cookieController.setSSIDCookie,
  sessionController.createSession,
  sessionController.servePage,
  (req, res) => {
    res.status(200).json(res.locals.payload);
  }
);

module.exports = router;