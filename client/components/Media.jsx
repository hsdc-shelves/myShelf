import React from 'react';
import { mediaTypesSchema } from '../constants/mediaTypeConfigs';

//perhaps turn this to a class component that holds a state about needing to update
//conditional render for a yet to be created component that will be the update window
//alternatively, modal?

export default (props) => {
  // console.log('media id in media component: ', props._id);
  // console.log('userId in media component;  ', props.userId)
  // console.log('idToUpdate in State: ', props.idToUpdate)

  return (
    <div className='media'>
      <p class='title'><strong>Title</strong> {props.title}</p>
      <p class='status'><strong>Status</strong> {mediaTypesSchema[props.type].statusNames[props.currentStatus]}</p>
      <button onClick={() => {props.updateIdInState(props._id)}}class='update'>Update</button>
      <button onClick={() => {props.delete(props._id, props.userId)}}class='delete'>Delete</button>
    </div>
  )
}

