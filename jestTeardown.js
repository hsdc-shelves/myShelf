const mongoose = require('mongoose');

module.exports = async (globalConfig) => {
  await server.close();

  const collections = Object.keys(mongoose.connection.collections);
  for (const collection of collections) {
    await mongoose.connection.collections[collection].deleteMany();
  }

  await mongoose.connection.close();
}