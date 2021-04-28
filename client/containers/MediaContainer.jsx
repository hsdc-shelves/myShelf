import React, { Component } from 'react';
import { connect } from 'react-redux';

import Media from '../components/Media.jsx';
import  { deleteMediaActionCreator } from '../actions/mediaActionCreators.js';
//if you export as a single function
//you have to import the func in brackets with the exact same name
//contain the brackets when importing as a single func
const mapStateToProps = (state) => ({
  media: state.media.media,
  selectedType: state.media.selectedType,
  userId: state.user.userProfile._id,
});

const mapDispatchToProps = (dispatch) => ({
  delete: (mediaId, userId) => dispatch(deleteMediaActionCreator(mediaId, userId))
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
        console.log('userid:', this.props.userId)
        // console.log("media from mediacontainer", media, "index from mediacontainer", idx)
        medias.push(<Media 
          {...media}
          userId={this.props.userId}
          delete={this.props.delete}
          key={`media-${idx}`}
        />)
      })
    
    return (
      <div id='media-container'>
        {medias}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaContainer);