/**
 * Coupon.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    pomotionName: {
      type: 'string'
    },
    couponCode: {
      type: 'string'
    },
    discountType: {
      type: 'string'
    },
    discountValue: {
      type: 'string'
    }
  }
};
