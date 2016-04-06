var request = require('supertest');
var Cookies;
describe('cart controller', function() {
  describe('#clear cart && add to cart', function() {
    it('should clear cart', function(done) {
      var req = request(sails.hooks.http.app).delete('/cart')
      req.send()
        .expect(200)
        .end(function(err, res) {
          Cookies = res.headers['set-cookie'].pop().split(';')[0];
          if (err) throw err;
          done()
        })
    })
    it('should add one product to cart', function(done) {
      var req = request(sails.hooks.http.app).post('/cart')
      req.cookies = Cookies
      req.send({
          SKU: '5e752420-fb32-11e5-970c-712cb73614a4'
        })
        .expect(200)
        .end(function(err, res) {
          Cookies = res.headers['set-cookie'].pop().split(';')[0];
          if (err) throw err
          console.log('add to cart', res.body)
          if (res.body.items) {
            done()
          }
        })
    })
    it('should increase qty', function(done) {
      var req = request(sails.hooks.http.app).post('/cart')
      req.cookies = Cookies
      req.send({
          SKU: '5e752420-fb32-11e5-970c-712cb73614a4'
        })
        .expect(200)
        .end(function(err, res) {
          Cookies = res.headers['set-cookie'].pop().split(';')[0];
          if (err) return done(err);
          console.log('add to cart', res.body, req.session)
          done();
        })
    })
    it('add coupon', function(done) {
      var req = request(sails.hooks.http.app).get('/applyCouponCode/TEST-459')
      req.cookies = Cookies
      req.send()
        .expect(200)
        .end(function(err, res) {
          Cookies = res.headers['set-cookie'].pop().split(';')[0];
          if (err) return done(err);
                    
          done();
        })
    })
  })
})
