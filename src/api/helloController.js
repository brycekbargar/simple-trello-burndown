module.exports = {
  get: function respond(req, res, next) {
    res.send('hello ' + req.params.name);
    next();
  }
};
