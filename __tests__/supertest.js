const request = require('supertest');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { profile } = require('console');

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
  
  
})