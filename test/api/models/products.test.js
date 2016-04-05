describe('ProductModel', function() {

  describe('#create()', function() {
    it('should create a random product', function(done) {

      var uuid = require('uuid')
      Price.create({
        amount: Math.random() * 100000,
        currency: 'IDR'
      }).then(function(price) {
        var product = {
          SKU: uuid.v1(),
          name: 'test ' + uuid.v1(),
          price: price.id
        }
        console.log(product)
        Product.create(product)
          .then(function(results) {
            // some tests
            done();
          })
          .catch(done);
      })

    });
  });
  describe('#find and populate()', function() {
    it('should populate product and price', function(done) {

      var uuid = require('uuid')
      Product.find()
        .populate('price', {
          select: ['amount', 'currency']
        })
        .then(function(results) {
          // some tests
          console.log(results)
          done();
        })
        .catch(done);
    })

  });
})
