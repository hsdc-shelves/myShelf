const request = require('supertest');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { hasUncaughtExceptionCaptureCallback } = require('process');

// const server = await require('../server/server.js');
const url = 'http://localhost:3000';

describe('Route Tests', () => {

  let server;
  beforeAll(async () => {
    server = await require('../server/server.js')
  })

  afterAll(async () => {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collection of collections) {
      await mongoose.connection.collections[collection].deleteMany();
    }
    server.close();
    await mongoose.connection.close();
  })

  describe('User Routes', () => {

    describe('Media Routes', () => {

      let fakeUserId;
      let fakeMediaId;
      let fakeMediaTitle;
      let fakeMediaType; 
      let fakeMediaCurrentStatus;

      beforeAll(() => {
        return request(server)
          .post('/api/users/create')
          .set('Content-Type', 'application/json')
          .send({
            username: 'pennyFake5',
            password: 'abcd',
            email: 'fakeEmail5@gmail.com',
            firstName: 'Penny',
            lastName: 'Fake'
          })
          .then((response) => {
            fakeUserId = response.body.userProfile._id;
          })
          .catch(err => {
            console.log(err)
          })
      })

      beforeAll(()=> {
        let fakeMediaEntry = {
          title: 'Fake Title',
          type: 'Book',
          currentStatus: 'complete'
        }

        return request(server)
            .post(`/api/media?userId=${fakeUserId}`)
            .set('Content-Type', 'application/json')
            .send(fakeMediaEntry)
            .then(response => {
              const { _id: mediaId, title, type, currentStatus } = response.body;
              fakeMediaId = mediaId;
              fakeMediaTitle = title;
              fakeMediaType = type;
              fakeMediaCurrentStatus = currentStatus;
            })
      })

      describe('POST MEDIA', () => {
        let fakeMediaEntry = {
          title: 'Fake Thing',
          type: 'Song',
          currentStatus: 'backlog'
        }
        it ('should add media to the user document', ()=> {
          return request(server)
            .post(`/api/media?userId=${fakeUserId}`)
            .set('Content-Type', 'application/json')
            .send(fakeMediaEntry)
            .then(response => {
              const { title, type, currentStatus } = response.body
            
              expect(response.status).toBe(200)
              expect(title).toBe(fakeMediaEntry.title)
              expect(type).toBe(fakeMediaEntry.type)
              expect(currentStatus).toBe(fakeMediaEntry.currentStatus)

            })
        })
      })

      describe('GET MEDIA', ()=> {

        it ('should get the media from a user', ()=>{
          return request(server)
          .get(`/api/media?userId=${fakeUserId}`)
          .then(response => {
            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
            expect(response.body.length).toBe(2)

          })
        })
      })


      describe('UPDATE MEDIA', () => {

        const updatedMediaObject = {
          _id: fakeMediaId,
          title: 'Fake Thing 2',
          type: fakeMediaType,
          currentStatus: fakeMediaCurrentStatus
        }

        it('should update the whole media object and return the updated object', () => {
          return request(server)
          .put(`/api/media/${fakeUserId}`)
          .set('Content-Type', 'application/json')
          .send(updatedMediaObject)
          .then(response => {
            console.log('RESPONSE IN UPDATE MEDIA: ', response)
            const { _id: returnedMediaId, title: returnedTitle, type: returnedType, currentStatus: returnedCurrentStatus } = response.body;
            expect(response.status).toBe(200);
            expect(returnedMediaId).toBe(fakeMediaId)
            expect(returnedTitle).toBe(updateMediaObject.title)
            expect(returnedType).toBe(updatedMediaObject.type)
            expect(returnedCurrentStatus).toBe(updatedMediaObject.currentStatus);
          })
        })
      })



      describe('DELETE MEDIA', () => {

        it ('should delete the specific media of the user', () => {
          return request(server)
            .delete(`/api/media/${fakeUserId}/${fakeMediaId}`)
            .then(response => {
              const { _id: returnedMediaId, title, type, currentStatus } = response.body;
              expect(response.status).toBe(200)
              expect(returnedMediaId).toBe(fakeMediaId)
              expect(title).toBe(fakeMediaTitle)
              expect(type).toBe(fakeMediaType)
              expect(currentStatus).toBe(fakeMediaCurrentStatus)
            })
        })
      })

      
      
      
      
      



    })

  })   
  
})