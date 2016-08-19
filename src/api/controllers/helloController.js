module.exports = {
  get: function respond(req, res, next) {
  /** 
    * @params {string} name - Your name!
    * @returns {string} A greeting for you! 
    */
    res.send('hello ' + req.params.name);
    next();
  }
};
