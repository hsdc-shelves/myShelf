const express = require('express');
const router = express.Router();

const userController = require('../../controllers/userController');
const sessionController = require('../../controllers/sessionController');
const cookieController = require('../../controllers/cookieController');

// checks for valid session cookie -- is the user already in an active session?
router.get(
  '/',
  sessionController.isLoggedIn,
  userController.getUserDocumentBySSIDCookie,
  userController.constructUserData,
  (req, res) => {
    // json stringified response of sessionAuthenticated cookie
    res.status(200).json(res.locals.payload);
  }
);

// create user
router.post(
  '/create',
  userController.createUserDocument,
  cookieController.setSSIDCookie,
  sessionController.createSession,
  userController.constructUserData,
  (req, res) => {
    res.status(200).json(res.locals.payload);
  }
);

// user login
router.post(
  '/login',
  userController.getUserDocumentByUsername,
  userController.verifyPassword,
  sessionController.createSession,
  cookieController.setSSIDCookie,
  userController.constructUserData,
  (req, res) => {
    res.status(200).json(res.locals.payload);
  }
);

module.exports = router;