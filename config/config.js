module.exports = {
  port: process.env.PORT || 556677,
  environment: process.env.NODE_ENV,
  swaggerClientUrl: (process.env.HOSTNAME || './api/swagger') + '/swagger.yaml'
};
