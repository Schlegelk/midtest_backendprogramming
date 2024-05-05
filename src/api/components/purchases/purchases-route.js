const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const purchasesControllers = require('./purchases-controller');
const purchasesValidator = require('./purchases-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/purchases', route);

  // Get list of purchases
  route.get('/', authenticationMiddleware, purchasesControllers.getPurchases);

  // Create purchase
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(purchasesValidator.createPurchase),
    purchasesControllers.createPurchase
  );

  // Get purchase detail
  route.get('/', authenticationMiddleware, purchasesControllers.getPurchase);

  // Update purchase
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(purchasesValidator.updatePurchase),
    purchasesControllers.updatePurchase
  );

  // Delete purchase
  route.delete('/:id', authenticationMiddleware, purchasesControllers.deletePurchase);

};
