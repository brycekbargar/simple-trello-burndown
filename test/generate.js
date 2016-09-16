const randomstring = require('randomstring');

module.exports = {
  cardLinks: () => randomstring.generate({
    length: 8,
    readable: true
  }),
  listIds: () => randomstring.generate({
    length: 32,
    readable: true,
    charset: 'hex'
  }),
  enerate: (length, gen) => Array.apply(null, {length: length}).map(gen)
};

