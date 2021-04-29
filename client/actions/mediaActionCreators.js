import actions from '../constants/actions.js';
import { defaultFields } from '../constants/mediaTypeConfigs.js';

export const updateMediaTypeActionCreator = (e) => {
/*
action creator intended to update the currently-selected
media to display on the main application (filter for media type)
*/

  //name attribute on button is the NON-display name 
  //from mediaTypesSchema from ../constants/mediaTypeConfigs.js
  return {
    type: actions.UPDATE_SELECTED_MEDIA_TYPE,
    payload: e.target.name 
  }

//notes from backend: when we send the request include the entire media object
//that is to be updated. SO send the entireity of the new object that we want.
//to update.
//route param will be the userId. they will access the idea through the media doc
//

}

export const placeIdToUpdateInStateActionCreator = (mediaId) => {
  // console.log(mediaId)
  return{
    type: actions.UPDATE_ID_INSTATE,
    payload: mediaId
  }
}

//create an action that will send the newly updated bit of media to the back end
//somehow we also at the end of these need to update the idToUpdate val in state back to null


export const deleteMediaActionCreator = (mediaId, userId) =>  (dispatch) => {  
  
  fetch(`http://localhost:3000/api/media/${userId}/${mediaId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }})
  .then(res => res.json())
  .then(deletedDoc => { //the response be the deleted object, and we will grab the id off of that and we then go and fileter that out of state.
    console.log('deletedDoc', deletedDoc);
    const deleteId = deletedDoc._id
    dispatch({
      type: actions.DELETE_MEDIA,
      payload: deleteId
    })
  })
  .catch(err => {
    console.log('error deleting user from the DB in delteMedieActionCreator: ', err)
  })

}



export const getMediaActionCreator = (userId) => (dispatch) => {
  //this is a function within a function that is returning an anon func
  //that takes in (dispatch). When getMediaActionCreator is invoked it tgen only has to take in user id
  //and can have access to dispatch.
/*
thunked action creator to fetch all media for the user
*/
//thunked handles the asych middleware of redux
//

  fetch(`http://localhost:3000/api/media?userId=${userId}`)
    .then(res => res.json())
    .then(media => {
      console.log('media is', media);
      dispatch({
        type: actions.GET_MEDIA,
        payload: media
      })
    })
    .catch(err => {
      dispatch({
        type: actions.GET_MEDIA,
        payload: []
      })
    })
}


export const addMediaActionCreator = (e) => (dispatch, getState) => {
/*
thunked action creator to add new media
*/

  console.log('state is', getState());
  e.preventDefault();
  fetch(`http://localhost:3000/api/media?userId=${getState().user.userProfile._id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      [defaultFields.TYPE]: e.target[0].value,
      [defaultFields.TITLE]: e.target[1].value,
      [defaultFields.CURRENT_STATUS]: e.target[2].value 
    })
  })
    .then(res => res.json())
    .then(newMedia => {
      console.log('new media is: ', newMedia)
      dispatch({
        type: actions.ADD_MEDIA,
        payload: newMedia
      })
    })
    .catch(err => console.log('error in addMedia mAC', err))
    //Need to add a catch block and display error to user
}

export const updateMediaInDBActionCreator = (e) => (dispatch, getState) => {
  e.preventDefault();
  console.log('updating media with id', getState().media.idToUpdate)
  fetch(`http://localhost:3000/api/media/${getState().user.userProfile._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _id: getState().media.idToUpdate,
      [defaultFields.TYPE]: e.target[0].value,
      [defaultFields.TITLE]: e.target[1].value,
      [defaultFields.CURRENT_STATUS]: e.target[2].value
    })
  })
    .then(res => res.json())
    .then(updatedMedia => {
      console.log('updatedMedia from mAC is ,', updatedMedia)
      dispatch({
        //created actiontype, and switchcase in reducer
        type: actions.UPDATE_MEDIA_INFO,
        payload: updatedMedia
      })
      //need to dispatch again to restet idToUpdate in state to undefined
    })
    .catch(err => console.log('error in updateMedia mAC', err))
    
}

