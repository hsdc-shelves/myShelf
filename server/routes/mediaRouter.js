const express = require('express');
const router = express.Router();
const mediaController = require('../../controllers/mediaController');

router.get('/', mediaController.getMedia, (req, res) => {
  // on success retrieve the media profile
  res.status(200).json(res.locals.media);
});
  
// adding type of media
router.post('/', mediaController.addMedia, (req, res) => {
  // on success, send the media input
  res.status(200).json(res.locals.media);
});
  
// update a specific media entry
router.put('/', mediaController.updateMedia, (req, res) => {
  res.status(200).json(res.body);
});
  
// delete media entry
router.delete('/', mediaController.deleteMedia, (req, res) => {
  res.status(200).json(res.body);
});
  

module.exports = router;
