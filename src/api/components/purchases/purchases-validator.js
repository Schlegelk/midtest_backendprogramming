const joi = require('joi');

module.exports = {
  createPurchase: {
    body: {
      name: joi.string().required(),
      price: joi.string().required(),
      quantity: joi.string().required(),
    },
  },
  updatePurchase: {
    body: {
      name: joi.string().required(),
      price: joi.string().required(),
      quantity: joi.string().required(),
    }
  }
};
