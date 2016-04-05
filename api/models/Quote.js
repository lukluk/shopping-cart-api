/**
 * Quote.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    subtotal: {
      type: 'integer'
    },
    discount: {
      type: 'integer'
    },
    discountInfo: {
      type: 'string'
    },
    tax: {
      type: 'integer'
    },
    total: {
      type: 'integer'
    }
  }
};
