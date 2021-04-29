const request = require('supertest');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

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

    it('Should create a new user and provide the new userProfile with their document id', () => {

      const testUser = {
        username: 'testUser10',
        password: 'test',
        email: 'test10@example.com',
        firstName: 'Foo',
        lastName: 'Bar'
    }
    
      return request(url)
        .post('/api/users/create')
        .set('Content-Type', 'application/json')
        .send(testUser)
        .expect(200)
        .then(response => {
          expect(response).toEqual(1);
        });
    });
  });
  
  
})