require('./index.js').web()
  .then(w => w.start())
  .catch(console.log);
