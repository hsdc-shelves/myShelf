import React from 'react';
// import { mediaTypesSchema } from '../constants/mediaTypeConfigs';
import { defaultFields, mediaTypesSchema } from '../constants/mediaTypeConfigs';
import mediaStatuses from '../constants/mediaStatuses.js';

export default (props) => {

  return (
    <div className='updateMedia'>
      <form >
      {/* onSubmit=sendFormDataToDB */}
        <div>
         <label htmlFor='title'>Title </label>
         <input type='text' id='title'></input>
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