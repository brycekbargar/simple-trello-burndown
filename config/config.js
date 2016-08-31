module.exports = {
  port: process.env.PORT || 556677,
  environment: process.env.NODE_ENV,
  swaggerClientUrl: (process.env.HOSTNAME || './api/swagger') + '/swagger.yaml',
  trelloKey: process.env.TRELLO_KEY,
  trelloToken: process.env.TRELLO_TOKEN,
  trelloBoard: process.env.TRELLO_BOARD_ID,
};
