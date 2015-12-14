'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a product
 */
exports.create = function (req, res) {
  var product = new Product(req.body);
  product.createdBy = req.user;

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * Show the current product
 */
exports.read = function (req, res) {
  res.json(req.product);
};

/**
 * Update a product
 */
exports.update = function (req, res) {
  var product = req.product;

  product.title = req.body.title;
  product.code = req.body.code;
  product.price = req.body.price;
  product.annualFee = req.body.annualFee;
  product.owner = req.body.owner._id;
  product.description = req.body.description;  
  product.versions = req.body.versions;
  product.versions.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.released) - new Date(a.released);
  });

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * Delete an product
 */
exports.delete = function (req, res) {
  var product = req.product;

  product.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * List of products
 */
exports.list = function (req, res) {
  Product.find().sort('-created')
  .populate('createdBy', 'displayName')
  .populate('owner', 'displayName')
  .exec(function (err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(products);
    }
  });
};

exports.listByNew = function (req, res) {  
  var d = new Date();
  d.setMonth(d.getMonth() - 3);

  Product.find().sort('-created')
  .where('versions.released').gt(d)
  .populate('createdBy', 'displayName')
  .populate('owner', 'displayName')
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
 * Product middleware
 */
exports.productByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Product is invalid'
    });
  }

  Product.findById(id)
  .populate('createdBy', 'displayName')
  .populate('owner', 'displayName')
  .exec(function (err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return res.status(404).send({
        message: 'No product with that identifier has been found'
      });
    }
    req.product = product;
    next();
  });
};
