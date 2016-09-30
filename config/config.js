'use strict';

module.exports = {
  port: process.env.PORT || 556677,
  environment: process.env.NODE_ENV,
  swaggerClientUrl: (process.env.HOSTNAME || './api/swagger') + '/swagger.yaml',
  trello: {
    key: process.env.TRELLO_KEY,
    token: process.env.TRELLO_TOKEN,
    board: process.env.TRELLO_BOARD_ID,
    label: process.env.TRELLO_LABEL_ID
  },
  discord: {
    token: process.env.DISCORD_TOKEN
  },
  ScraperKey: process.env.SCRAPER_KEY
};
