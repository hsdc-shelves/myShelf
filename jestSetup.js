module.exports = async (globalConfig) => {
  global.server = await require('./server/server.js');
}