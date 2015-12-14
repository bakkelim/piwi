'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  code: {
    type: String,
    default: '',
    trim: true,
    required: 'Code cannot be blank'
  },
  price: {
    type: Number,
    default: 0,
    required: 'Price cannot be blank'
  },
  annualFee: {
    type: Number,
    default: 0,
    required: 'Annual fee cannot be blank'
  },
  versions: [
    { 
      label: {
        type: String,
        default: '',
        trim: true,
        required: 'Version cannot be blank'
      },
      released: {
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
  },
  owner : { 
    type: Schema.ObjectId, 
    ref: 'User' 
  }
});

mongoose.model('Product', ProductSchema);
