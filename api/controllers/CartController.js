/**
 * CartController
 *
 * @description :: Server-side logic for managing carts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var quoteLib = require(__dirname + '/quote.js')

function _updateQuote(session, cart, callback) {
  if (!cart.quote) {
    quoteLib.getQuote(session, cart.items, function(quote) {
      Quote.create(quote).then(function(q) {
        console.log('quote', q)
        var itemIds = []
        cart.items.forEach(function(item) {
          itemIds.push(item.id)
        })
        Cart.create({
          items: itemIds,
          quote: q.id,
          sessionId: session.sessionId
        }).then(function(cart) {
          callback && callback(cart)
        })
      })
    })
  } else {
    quoteLib.getQuote(session, cart.items, function(quote) {
      Quote.update({
        id: cart.quote.id
      }, quote).then(function(q) {
        Cart.findOne({
            sessionId: req.session.sessionId
          })
          .populate('items')
          .populate('quote')
          .then(function(newcart) {
            callback && callback(newcart)
          })
      })
    })
  }
}

module.exports = {
  addItem: function(req, res) {
    var SKU = req.body.SKU
    if (!SKU) {
      res.json({
        eror: true,
        message: 'SKU undefined'
      })
      return false
    }
    var qty = req.body.qty ? req.body.qty : 1
    var item = {
      SKU: SKU,
      qty: qty
    }
    Cart.findOne({
        sessionId: req.session.sessionId
      })
      .populate('items')
      .populate('quote')
      .then(function(cart) {
        console.log('cart', cart)
        if (!cart) {
          cart = {}
          cart.items = []
          cart.items.push(item)
        } else {
          var newItems = []
          cart.items.forEach(function(itemCart) {
            if (item.SKU == itemCart.SKU) {
              itemCart.qty = itemCart.qty + item.qty
            }
            newItems.push(itemCart)
          })
          cart.items = newItems
        }
        _updateQuote(req.session, cart, function(data) {
          res.json(data)
        })
      })
  },
  getList: function(req, res) {
    Cart.findOne({
      sessionId: req.session.sessionId
    }).then(function(cart) {
      if (!cart) res.json([])
      else res.json(cart.items)
    })
  },
  updateItem: function(req, res) {

    res.json({
      id: req.session.id
    })
  },
  getItemDetail: function(req, res) {
    Cart.findOne({
      sessionId: req.session.sessionId
    }).then(function(cart) {
      if (!cart) res.json([])
      else cart.items.find({
        id: req.params.itemId
      }).then(function(items) {
        res.json(items)
      })
    })
  },
  removeItem: function(req, res) {

    res.json({
      id: req.session.id
    })
  },
  removeAllItem: function(req, res) {
    Cart.destroy().then(function() {
      res.json({
        message: 'clear all cart'
      })
    })
  },
  applyCouponCode: function(req, res) {

    Coupon.findOne({
      couponCode: req.params.couponCode
    }).then(function(coupon) {
      if (!coupon) res.json({
        error: true,
        message: 'coupon code ' + req.params.couponCode + ' not valid',
        code: 401
      })
    })

  },
  getQuote: function(req, res) {
    Cart.findOne({
      sessionId: req.session.sessionId
    }).then(function(cart) {
      res.json({
        id: req.session.id
      })
    })
  },
  order: function(req, res) {

    res.json({
      id: req.session.id
    })
  }
};
