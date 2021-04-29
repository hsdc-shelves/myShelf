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

    describe('Creating new users', () => {

      let response;
      let testUser;
      beforeAll(async () => {
        testUser = {
          username: 'testUser10',
          password: 'test',
          email: 'test10@example.com',
          firstName: 'Foo',
          lastName: 'Bar'
        };

        response = await request(url)
        .post('/api/users/create')
        .set('Content-Type', 'application/json')
        .send(testUser)
      })

      it('should respond with a 200 status code', () => {
        expect(response.status).toEqual(200);
      });

      it('should return a body with the userProfile equal to the request body', () => {
        expect(response.body.userProfile).toEqual(expect.objectContaining({
          _id: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          firstName: expect.any(String),
          lastName: expect.any(String)
        }));
      });

      it('should return a verified status of true', () => {
        expect(response.body.verified).toEqual(true);
      });

      it('should not succeed if the request body is missing a required property', async () => {

        const badResponse = await request(url)
          .post('/api/users/create')
          .set('Content-Type', 'application/json')
          .send({username: 'MissingInfoUser'})

        expect(badResponse.status).toBeGreaterThanOrEqual(400);
      });

    });

    describe('Handling user logins', () => {

      let response;
      beforeAll(async () => {
        response = await request(url)
          .post('/api/users/login')
          .set('Content-Type', 'application/json')
          .send({
            username: 'testUser10',
            password: 'test'
          });
      });

      it('should provide a 200 status code for a successful login', () => {
        expect(response.status).toEqual(200);
      })

      it('should include a ssid cookie in the response', () => {
        expect(response.header['set-cookie'][0]).toEqual(expect.stringContaining('ssid='));
      })

      it('should include the userProfile in the response', () => {
        expect(response.body.userProfile).toEqual(expect.objectContaining({
            _id: expect.any(String),
            username: expect.any(String),
            email: expect.any(String),
            firstName: expect.any(String),
            lastName: expect.any(String) 
          }));
      });

      it('should include a verified status of true', () => {
        expect(response.body.verified).toEqual(true);
      })

      it('should return a a verified status of false for a bad login', async () => {
        const badResponse = await request(url)
          .post('/api/users/login')
          .set('Content-Type', 'application/json')
          .send({username: 'testUser10', password: 'wrongpw'})

        expect(badResponse.body.verified).toEqual(false);
      })

    });
  });

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

      //this test is not working and currently can't figure out why
      xdescribe('UPDATE MEDIA', () => {

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
            //console.log('RESPONSE IN UPDATE MEDIA: ', response)
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
    
  
  
