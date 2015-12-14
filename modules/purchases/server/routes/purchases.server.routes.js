'use strict';

/**
 * Module dependencies.
 */
var purchasesPolicy = require('../policies/purchases.server.policy'),
  purchases = require('../controllers/purchases.server.controller');

module.exports = function (app) {
  // Purchases collection routes
  app.route('/api/purchases').all(purchasesPolicy.isAllowed)
    .get(purchases.list)
    .post(purchases.create);

  // Single purchase routes
  app.route('/api/purchases/:purchaseId').all(purchasesPolicy.isAllowed)
    .get(purchases.read)
    .put(purchases.update)
    .delete(purchases.delete);

  // Single purchase routes
  app.route('/api/company-purchases/:compurId').all(purchasesPolicy.isAllowed)
    .get(purchases.listByCompany);
    
  app.route('/api/product-purchases/:propurId').all(purchasesPolicy.isAllowed)
    .get(purchases.listByProduct);
    
  app.route('/api/purchases-expired').all(purchasesPolicy.isAllowed)
    .get(purchases.listByExpired);
 
   app.route('/api/purchases-expires').all(purchasesPolicy.isAllowed)
    .get(purchases.listByExpires); 

  // Finish by binding the purchase middleware
  app.param('purchaseId', purchases.purchaseByID);
  app.param('compurId', purchases.listByCompany);
  app.param('propurId', purchases.listByProduct);
};
