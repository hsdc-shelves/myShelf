import React, { Component } from 'react';
import { connect } from 'react-redux';

import Media from '../components/Media.jsx';
import UpdateMedia from "../components/updateMedia.jsx"
import  { deleteMediaActionCreator } from '../actions/mediaActionCreators.js';
import { placeIdToUpdateInStateActionCreator } from '../actions/mediaActionCreators.js'
import { updateMediaInDBActionCreator } from '../actions/mediaActionCreators.js'
//if you export as a single function
//you have to import the func in brackets with the exact same name
//contain the brackets when importing as a single func
const mapStateToProps = (state) => ({
  media: state.media.media,
  selectedType: state.media.selectedType,
  userId: state.user.userProfile._id,
  idToUpdate: state.media.idToUpdate
});

const mapDispatchToProps = (dispatch) => ({

  delete: (mediaId, userId) => dispatch(deleteMediaActionCreator(mediaId, userId)),
  updateIdInState: (idToUpdate) => dispatch(placeIdToUpdateInStateActionCreator(idToUpdate)),
  updateInDB: (e) => dispatch(updateMediaInDBActionCreator(e))
})

class MediaContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const medias = [];
    
    //Display only media that match the user-selected media type
    this.props.media
      .filter(media => media.type === this.props.selectedType)
      .forEach((media, idx) => {
        console.log('media id', media._id)
        if (media._id === this.props.idToUpdate){
          medias.push(
            <UpdateMedia {...media}
            updateInDB={this.props.updateInDB}
            />
            //if props.state.idToUpdate === media._id
        // push <UpdateMedia component with props from media
        // other wise, do the below
        //
          )
        }
        if (media._id !== this.props.idToUpdate){
          medias.push(<Media 
            {...media}
            userId={this.props.userId}
            delete={this.props.delete}
            updateIdInState={this.props.updateIdInState}
            key={`media-${idx}`}
          />)
        }
      })
    //wesley said, just make one new component and filter for the val in state that is need to be updated
    //then if the filter going into medias hits that id render updtae media component for that for 
    // All wesleys idea
    return (
      <div id='media-container'>
        {medias}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaContainer);