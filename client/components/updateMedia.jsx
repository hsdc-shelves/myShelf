import React from 'react';
// import { mediaTypesSchema } from '../constants/mediaTypeConfigs';
import { defaultFields, mediaTypesSchema } from '../constants/mediaTypeConfigs';
import mediaStatuses from '../constants/mediaStatuses.js';

export default (props) => {
  const typeOptions = [];
  Object.keys(mediaTypesSchema).forEach((mediaType, idx) => {
    typeOptions.push(<option value={mediaType} key={`type-option-${idx}`}>{mediaTypesSchema[mediaType].displayName}</option>)
  });

  return (
    <div className='updateMedia'>
      <form onSubmit={props.updateInDB} >
      {/* onSubmit=sendFormDataToDB */}

        <div>
            <label htmlFor={defaultFields.TYPE}>Type:</label>
            <select id={defaultFields.TYPE}>
              {typeOptions}
            </select>
          </div>

        <div>
         <label htmlFor='title'>Title </label>
         <input type='text' id='title'placeholder={props.title}></input>
        </div>

        <div>
          <label htmlFor={defaultFields.CURRENT_STATUS}>Current Status:</label>
            <select id={defaultFields.CURRENT_STATUS}>
              <option value={mediaStatuses.BACKLOG}>Backlog</option>
              <option value={mediaStatuses.IN_PROGRESS}>In Progress</option>
              <option value={mediaStatuses.COMPLETE}>Complete</option>
            </select>
        </div>

        <div>
            <input type="submit" id='update' value="Update This Thang!"></input>
          </div>
      </form>
    </div>
    
  )
}