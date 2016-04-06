/**
 * Quote.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  populateFields: ['subtotal', 'discount', 'discountInfo', 'tax', 'total'],
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
  },
  getQuote: function(session, items, cb) {
    var subtotal = 0
    var discount = 0
    var discountName = ''    

    function _getTax() {
      // @TODO : get tax from site configuration
      return 0.01
    }

    function _acumulateSubtotal(callback, n) {
      if (!n) n = 0

      if (n >= items.length) {
        callback && callback()
        return false
      } else {
        //console.log('SKU', items[n].SKU)
        Product.findOne({
            SKU: items[n].SKU.trim()
          })
          .populate('price')
          .then(function(product) {
            //console.log('product', product)
            var price = 0
            if (product) {
              price = Product.getPrice(product, session.currency)
              //console.log('price', price)
            }
            subtotal = subtotal + (price * items[n].qty)
            var index = (n + 1)
            _acumulateSubtotal(callback, index)
          })
      }
    }

    function _calcCoupon(callback) {
      if (session.couponCode) {
        Coupon.findOne({
          couponCode: session.couponCode
        }).then(function(coupon) {
          var discount = 0
          if (coupon) {
            discountName = coupon.pomotionName
            switch (coupon.discountType) {
              case 'percent':
                discount = subtotal * (coupon.discountValue / 100)
                break
              case 'fixed':
                discount = subtotal - coupon.discountValue
                break
            }
          }
          callback && callback()
        })
      } else
        callback && callback()
    }
    _acumulateSubtotal(function() {
      _calcCoupon(function() {
        var tax = 0
        var subtotal_discount = subtotal - discount
        tax = subtotal_discount * _getTax()
        var total = subtotal_discount + tax
        cb && cb({
          subtotal: subtotal,
          discount: discount,
          discountInfo: discountName,
          tax: tax,
          total: total
        })
      })
    })

  }
};
