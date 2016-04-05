function getQuote(session, items, cb) {
  var subtotal = 0
  var discount = 0
  var discountName = ''
  console.log('items', items)

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
      Product.findOne({
        SKU: items[n]
      }).then(function(product) {
        console.log('product', product)
        var price = 0
        if (product) {
          price = Product.price(product, session.currency)
          console.log('price', price)
        }
        subtotal = subtotal + price
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
  _acumulateSubtotal(_calcCoupon(function() {
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
  }))

}

module.exports = {
  getQuote: getQuote
}
