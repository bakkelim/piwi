'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Purchase Schema
 */
var PurchaseSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  product : { 
    type: Schema.ObjectId, 
    ref: 'Product' 
  },
  company : { 
    type: Schema.ObjectId, 
    ref: 'Company' 
  },
  price: {
    type: Number,
    default: 0,
    required: 'Price cannot be blank'
  },
  annualFees: [
    { 
      fee: {
        type: Number,
        default: 0,
        required: 'Fee cannot be blank'
      },
      purchased: {
        type: Date,
        default: Date.now
      },
      expires: {
        type: Date,
        default: Date.now
      }
    }
  ],
  description: {
    type: String,
    default: '',
    trim: true
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Purchase', PurchaseSchema);
