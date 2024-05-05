const joi = require('joi');

module.exports = {
  createProduct: {
    body: {
      name: joi.string().required(),
      description: joi.string().required(),
      price: joi.string().required(),
      quantity: joi.string().required(),
      category: joi.string().required(),
    },
  },
  updateProduct: {
    body: {
      name: joi.string().required(),
      description: joi.string().required(),
      price: joi.string().required(),
      quantity: joi.string().required(),
      category: joi.string().required(),
    }
  }
};
