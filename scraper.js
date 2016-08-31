require('./index.js').scraper()
  .then(s => s.start())
  .catch(console.log);
