// import Media schema from models
const { User } = require('../models/mainModels.js');

// object contains all mediaController middleware
const mediaController = {};

//TODO: Refactor with async/await
// middleware to get entire media profile of user
mediaController.getMedia = (req, res, next) => {
  // find all media catalog
  console.log(req.params, req.query);
  User.findOne({_id: req.query.userId})
    .exec()
    // response is the found User
    .then((response) => {
      // console.log to see if fired
      console.log('mediaController getMedia fired');
      // if no user found
      if (!response) {
        // store an empty object in local memory for front end
        res.locals.media = {}; //shouldnt this be an empty array
        return next();
      }
      // store in local memory the User.media
      res.locals.media = response.media;
      return next();
    })
    .catch((error) => {
      console.log(err.stack);
      return next('error in getMedia middleware');
    });
};


// add a media type to user profile
mediaController.addMedia = (req, res, next) => {
  // finds and update media property on user and returns the updated user
  User.findOneAndUpdate(
    // filter for the _id
    {_id: req.query.userId},
    // $push is a mongoDb method to add into media Array
    {$push: {media: req.body}},
    // this property shows the new updated version
    {new: true}
  )
    .then((user) => {
      // store in local memory that last media item just added
      res.locals.media = user.media[user.media.length - 1];
      return next();
    })
    .catch((err) => {
      console.log(err.stack);
      return next('error in addMedia middleware');
    });
};

// update the entry of a specific media type
mediaController.updateMedia = async (req, res, next) => {
  
  const { userId } = req.params;
  const { _id: mediaId } = req.body;

  try {
    
    const updateUserMediaObj = await User.findOneAndUpdate(
      //filter out the user in the user collection
      { _id: userId }, 
      //update the media field in User document with the received data from the client
      { $set: { media: req.body }}, 
      //projection allows for a specific part of the document to be returned, then inside the media array in the user doc, return only the media object that matches the mediaID, the returned document will be the user id and a media with one value in the array of the updated media
      { new: true, projection: { media: {$elemMatch: {_id: mediaId} } } }
    ).exec();
    
    //if user isn't found- return error status of 404
    if (updateUserMediaObj === null) {
      return next({
        log: `User ${userId} does not exist in the database, returned data came back as null`,
        status: 404,
        message: `Error Occurred When Finding User in Database, Please input a valid User ID`
      })
    }

    //take the returned data from the media array and save it to the response body
    res.locals.media = updateUserMediaObj.media[0];
    return next();

  } catch (err) {
    //if user is found but could not update media in the array
      return next(
      {
        log: `Couldn't Update Media for the User: ${err}`,
         message: {error: `Error Occured When Updating Media with the id of ${mediaId} in the User Collection for user ${userId}`}
      })
   }
}


// updates the User by pulling the requested media item
mediaController.deleteMedia = async (req, res, next) => {
  
  console.log('Delete media request received: ', req.params);

  const { userId, mediaId } = req.params;
  try {
    //Remove the media sub-document for the user
    const userWithDeletedMedia = await User.findOneAndUpdate( 
      {_id: userId},
      {$pull: { media : { _id: mediaId }} },
      {projection: {media: {$elemMatch: {_id: mediaId}}}} //Return only the media field from the user
    ).exec()

    if (userWithDeletedMedia === null) {
      return next({
        log: `User ${userId} does not exist in the database, returned data came back as null`,
        status: 404,
        message: `Error Occurred When Finding User in Database, Please input a valid User ID`
      })
    }

    res.locals.media = userWithDeletedMedia.media[0];
    return next();

  } catch (err) {
    return next({log: `Could not remove media ${mediaId} from database for user ${userId}: ${err}`})
  }

};

// exports mediaController object to server
module.exports = mediaController;
