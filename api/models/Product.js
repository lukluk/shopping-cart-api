/**
 * Product.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  getPrice: function(product, currency) {
    currency = currency ? currency : 'IDR'
    var price = product.price.filter(function(p) {
      return p.currency == currency
    })    
    if (!price) {
      return 0
    } else
      return price[0].amount
  },
  attributes: {
    SKU: {
      type: 'string'
    },
    price: {
      collection: 'Price'
    },
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    }
  }
};
