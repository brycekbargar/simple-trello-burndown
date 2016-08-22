'use strict';

module.exports = (params) => {
  let swaggerParams = {
    swagger: {
      params: {
      }
    }
  };
  params.forEach(p => swaggerParams.swagger.params[p.name] = { value: p.value });

  return swaggerParams;
};
