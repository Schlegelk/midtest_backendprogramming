const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const productsControllers = require('./products-controller');
const productsValidator = require('./products-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/products', route);

  // Get list of products
  route.get('/', authenticationMiddleware, productsControllers.getProducts);

  // Create product
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(productsValidator.createProduct),
    productsControllers.createProduct
  );

  // Get product detail
  route.get('/', authenticationMiddleware, productsControllers.getProduct);

  // Update product
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(productsValidator.updateProduct),
    productsControllers.updateProduct
  );

  // Delete product
  route.delete('/:id', authenticationMiddleware, productsControllers.deleteProduct);

};
