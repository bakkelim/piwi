'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Purchase = mongoose.model('Purchase'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a purchase
 */
exports.create = function (req, res) {
  var purchase = new Purchase(req.body);
  purchase.createdBy = req.user;

  purchase.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(purchase);
    }
  });
};

/**
 * Show the current purchase
 */
exports.read = function (req, res) {
  res.json(req.purchase);
};

/**
 * Update a purchase
 */
exports.update = function (req, res) {
  var purchase = req.purchase;

  purchase.product = req.body.product._id;
  purchase.company = req.body.company._id;
  purchase.price = req.body.price;
  purchase.description = req.body.description;
  purchase.annualFees = req.body.annualFees;
  purchase.annualFees.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.purchased) - new Date(a.purchased);
  });
  purchase.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(purchase);
    }
  });
};

/**
 * Delete an purchase
 */
exports.delete = function (req, res) {
  var purchase = req.purchase;

  purchase.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(purchase);
    }
  });
};

/**
 * List of Purchases
 */
exports.list = function (req, res) {

  Purchase.find().sort('-created')
  .populate('createdBy', 'displayName')
  .populate('product', 'title')
  .populate('company', 'name')
  .exec(function (err, purchases) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(purchases);
    }
  });
};

/**
 * List of Purchases
 */
exports.listByExpired = function (req, res) {

  Purchase.find()
  .sort('-created')  
  //.slice('annualFees', 1) 
  
  //.select({'annualFees.expires.$': 1})
  //.lt('annualFees.expires',new Date())
  .where('annualFees.expires').lt(new Date())
  .populate('createdBy', 'displayName')
  .populate('product', 'title')
  .populate('company', 'name')
  .exec(function (err, purchases) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      purchases.forEach(function (purchase, index, object){        
        if(purchase.annualFees[0].expires > new Date())
          object.splice(index, 1);
      });
      res.json(purchases);
    }
  });
};

exports.listByExpires = function (req, res) {  
  var d = new Date();
  d.setMonth(d.getMonth() + 3);

  Purchase.find().sort('-created')
  .where('annualFees.expires').lt(d).gt(new Date())
  .populate('createdBy', 'displayName')
  .populate('product', 'title')
  .populate('company', 'name')
  .exec(function (err, purchases) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      purchases.forEach(function (purchase, index, object){        
        if(purchase.annualFees[0].expires > d)
          object.splice(index, 1);
      });
      res.json(purchases);
    }
  });
};

/**
 * List of Purchases
 */
exports.listByCompany = function (req, res, next, compurId) {

  Purchase.find({ 'company': compurId }).sort('-created')
  .populate('createdBy', 'displayName')
  .populate('product', 'title') 
  .exec(function (err, purchases) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(purchases);
    }
  });
};

exports.listByProduct = function (req, res, next, propurId) {
  Purchase.find({ 'product': propurId }).sort('-created')
  .populate('createdBy', 'displayName')
  .populate('company', 'name') 
  .exec(function (err, purchases) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(purchases);
    }
  });
};

/**
 * Purchase middleware
 */
exports.purchaseByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Purchase is invalid'
    });
  }
  
  Purchase.findById(id)
  .populate('createdBy', 'displayName')
  .populate('product', 'title')
  .populate('company', 'name')
  .exec(function (err, purchase) {
    if (err) {
      return next(err);
    } else if (!purchase) {
      return res.status(404).send({
        message: 'No purchase with that identifier has been found'
      });
    }
    req.purchase = purchase;
    next();
  });
};
