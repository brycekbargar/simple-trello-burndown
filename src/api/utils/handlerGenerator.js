module.exports = (server) =>
  (method, path, controller) =>
    server[method]({
      path: path,
      docString: controller[method].__doc__
    }, controller[method]);
