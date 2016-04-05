var request = require('supertest');
describe('cart controller', function() {
  describe('#add to cart', function() {
    it('should add SKU to cart', function(done) {
      request(sails.hooks.http.app)
        .post('/cart')
        .send({SKU:'5e752420-fb32-11e5-970c-712cb73614a4'})
        .expect(200)
        .end(function(err, res){
        if (err) return done(err);
        console.log(res.body)
        done();
      });

    })
  })
})
