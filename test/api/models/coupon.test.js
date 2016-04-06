describe('CouponModel', function() {

  describe('#create()', function() {
    it('should create a random coupon', function(done) {

      var uuid = require('uuid')

      Coupon.create({
        pomotionName: 'test',
        couponCode: 'TEST-'+Math.ceil((Math.random()*1000)),
        discountType: 'fixed',
        discountValue: Math.ceil((Math.random()*10000))
      })
        .then(function(results) {
          // some tests
          done();
        })
        .catch(done)
    })
  })
})
