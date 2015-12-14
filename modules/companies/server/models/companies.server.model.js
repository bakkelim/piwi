'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Company Schema
 */
var CompanySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
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

mongoose.model('Company', CompanySchema);
