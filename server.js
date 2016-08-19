const server = require('./src/server.js');

console.log(server.router.mounts);

const port = process.env.PORT || 80;

server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});
