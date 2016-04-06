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
          if (!results) done({
            error: 'results undefined'
          })
          else done()
        })
        .catch(done);
    })

  })
  describe('#findOne and populate Associates', function() {
    it('should populate product and price', function(done) {

      var uuid = require('uuid')
      Product.findOne({
          SKU: '5e752420-fb32-11e5-970c-712cb73614a4'
        })
        .populate('price', {
          select: ['amount', 'currency']
        })
        .then(function(results) {
          // some tests
          //console.log(results)
          if (!results) done({
            error: 'results undefined'
          })
          else done()
        })
        .catch(done);
    })

  })
})
