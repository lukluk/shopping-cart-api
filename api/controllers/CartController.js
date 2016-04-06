/**
 * CartController
 *
 * @description :: Server-side logic for managing carts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


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
        sessionId: req.session.id
      })
      .populate('items', {
        select: CartItem.populateFields
      })
      .populate('quote', {
        select: Quote.populateFields
      })
      .then(function(cart) {
        if (!cart) {
          cart = {}
          cart.items = []
          cart.items.push(item)
        } else {
          var newItems = []
          var found = false
          cart.items.forEach(function(itemCart) {
            if (item.SKU == itemCart.SKU) {
              itemCart.qty = parseInt(itemCart.qty) + parseInt(item.qty)
              found = true
            }
            newItems.push(itemCart)
          })
          if (!found) newItems.push(item)
          cart.items = newItems
        }
        Cart.updateCart(req.session, cart, function(data) {
          res.json(data)
        })
      })
  },
  getList: function(req, res) {
    Cart.findOne({
        sessionId: req.session.id
      })
      .populate('items', {
        select: CartItem.populateFields
      })
      .populate('quote', {
        select: Quote.populateFields
      })
      .then(function(cart) {
        if (!cart) res.json([])
        else {
          CartItem.populateItems(cart.items, function() {
            res.json(cart)
          })
        }
      })
  },
  updateItem: function(req, res) {
    var cart = {}
    CartItem.findOne({
      id: req.params.itemId
    }).then(function(item) {
      if (!item) {
        res.json({
          error: true,
          message: 'itemid notfound'
        })
        return false
      }
      item.qty = req.body.qty ? req.body.qty : item.qty
      item.options = req.body.options ? req.body.options : item.options

      cart.items = []
      cart.items.push(item)
      Cart.updateCart(req.session, cart, function(data) {
        res.json(data)
      })
    })

  },
  updateCart: function(req, res) {
    var cart = {}
    cart.items = req.body.items
    Cart.updateCart(req.session, cart, function(data) {
      res.json(data)
    })
  },
  getItemDetail: function(req, res) {
    Cart.findOne({
      sessionId: req.session.id
    }).then(function(cart) {
      if (!cart) res.json([])
      else CartItem.findOne({
        id: req.params.itemId
      }).then(function(items) {
        console.log('items', items)
        CartItem.populateItems([items], function(items) {
          res.json(items)
        })
      })
    })
  },
  removeItem: function(req, res) {
    CartItem.destroy({
      id: req.params.itemId
    }).then(function(item) {
      res.json(item)
    })

  },
  clearCart: function(req, res) {
    Cart.destroy({
      sessionId: req.session.id
    }).then(function() {
      res.json({
        message: 'clear cart'
      })
    })
  },
  applyCouponCode: function(req, res) {

    Coupon.findOne({
      couponCode: req.params.couponCode
    }).then(function(coupon) {
      if (!coupon) {
        res.json({
          error: true,
          message: 'coupon code ' + req.params.couponCode + ' not valid',
          code: 401
        })
        return false
      }
      req.session.couponCode = req.params.couponCode
      console.log(req.session.id)
      Cart.findOne({
        sessionId: req.session.id
      })
      .populate('items', {
        select: CartItem.populateFields
      })
      .populate('quote', {
        select: Quote.populateFields
      })
      .then(function(cart) {
        console.log(cart)
        if(!cart) {
          res.json({
            error: true,
            message: 'session over'
          })
          return false
        }
        Cart.updateCart(req.session, cart, function(data) {
          res.json(data)
        })
      })

    })

  },
  order: function(req, res) {

  }
};
