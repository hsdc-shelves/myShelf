// import Media schema from models
const { User } = require('../models/mainModels.js');

// object contains all mediaController middleware
const mediaController = {};

// middleware to get entire media profile of user
mediaController.getMedia = async (req, res, next) => {
  //userId will be sent to the backend via query parameters
  const { userId } = req.query;
  // find all media catalog
  
  try {
  const userDoc = await User.findOne({_id: userId}).exec()
    // if no user was found, return an empty media object
    if (!userDoc) {
      res.locals.media = {};
      return next();
    }
    
    res.locals.media= userDoc.media;
      
    return next();

  } catch (err) {
    return next({
      log: `User ${userId} does not exist in the database, returned data came back as null`,
      status: 500,
      message: `Error Occurred When Finding User in Database, Please input a valid User ID`
    })
  }
};


// add a media type to user profile
mediaController.addMedia = async (req, res, next) => {
  // finds and update media property on user and returns the updated user
  const { userId } = req.query;

  try {

    const userMediaArray = await User.findOneAndUpdate(
      // filter for the _id
      { _id: userId },
      // $push is a mongoDb method to add into media Array
      { $push: { media: req.body } },
      // this property shows the new updated version
      { new: true, projection: "media"} 
      
    ).exec();

    if (!userMediaArray){
      return next({
        log: `User ${userId} does not exist in the database, returned data came back as null`,
        status: 400,
        message: `Error Occurred When Finding User in Database, Please input a valid User ID`
      })
    }

      // store in local memory that last media item just added
      res.locals.media = userMediaArray.media[userMediaArray.media.length - 1];
      return next();

  } catch (err) {
    return next(
      {
        log: `Couldn't Update Media for the User: ${err}`,
         message: {error: `Error Occured When Adding Media to the user in the User Collection for user ${userId}`}
      })
  }
};

// update the entry of a specific media type
mediaController.updateMedia = async (req, res, next) => {
  
  const { userId } = req.params;
  const { _id: mediaId, title, type, currentStatus } = req.body;


  try {

    const updateUserMediaObj = await User.findOneAndUpdate(
          //filter out the user in the user collection, and finds the specific media within the media array of the user document
          { _id: userId, "media._id": mediaId }, 
          //updates all the fields in the object of the mediaId
          { $set:
            { 
              "media.$.title" : title,
              "media.$.type": type,
              "media.$.currentStatus": currentStatus,
            }
          }, 
          //projection allows for a specific part of the document to be returned, then inside the media array in the user doc, return only the media object that matches the mediaID, the returned document will be the user id and a media with one value in the array of the updated media
          { new: true, projection: { media: {$elemMatch: {_id: mediaId} } }  }
        ).exec();
   
        

    if (!updateUserMediaObj) {
      return next({
        log: `User ${userId} does not exist in the database`,
        status: 400,
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

// try {
    
//   const updateUserMediaObj = await User.findOneAndUpdate(
//     //filter out the user in the user collection
//     { _id: userId }, 
//     //update the media field in User document with the received data from the client
//     { $set: { media : req.body }}, 
//     //projection allows for a specific part of the document to be returned, then inside the media array in the user doc, return only the media object that matches the mediaID, the returned document will be the user id and a media with one value in the array of the updated media
//     { new: true, projection: { media: {$elemMatch: {_id: mediaId} } } }
//   ).exec();
  
//   //if user isn't found- return error status of 404
//   if (updateUserMediaObj === null) {
//     return next({
//       log: `User ${userId} does not exist in the database, returned data came back as null`,
//       status: 404,
//       message: `Error Occurred When Finding User in Database, Please input a valid User ID`
//     })
//   }

//   
