require('./index.js').discord()
  .then(s => s.start())
  .catch(console.log);
