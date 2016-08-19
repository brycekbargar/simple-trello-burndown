const helloController = require('./api/controllers/helloController.js');

module.exports = (server) => {
  let handle = require('./api/utils/handlerGenerator.js')(server);

  handle('get', '/api/hello/:name', helloController);
};

