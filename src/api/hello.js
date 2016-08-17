module.exports = function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}
