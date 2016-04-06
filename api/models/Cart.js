/**
 * Cart.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    sessionId: {
      type: 'string'
    },
    items: {
      collection: 'CartItem'
    },
    quote: {
      model: 'Quote',
      unique: true
    }
  },
  updateCart: function(session, cart, callback) {
    if (!cart.sessionId) {
      Quote.getQuote(session, cart.items, function(quote) {
        Quote.create(quote).then(function(q) {
          CartItem.create(cart.items).then(function(items) {
            var itemIds = []
            items.forEach(function(item) {
              itemIds.push(item.id)
            })
            //console.log('itemIds',itemIds)
            Cart.create({
                items: itemIds,
                quote: q.id,
                sessionId: session.idx
              })
              .then(function(cart) {
                Cart.find({
                    sessionId: session.idx
                  })
                  .populate('items', {
                    select: CartItem.populateFields
                  })
                  .populate('quote', {
                    select: Quote.populateFields
                  })
                  .then(callback)
              })
          })
        })
      })
    } else {
      Quote.getQuote(session, cart.items, function(quote) {
        var updateItems = cart.items.filter(function(v) {
          if(v.id){
            return true
          }else {
            return false
          }
        })
        var createItems = cart.items.filter(function(v) {
          if(v.id){
            return false
          }else {
            return true
          }
        })

        CartItem.updateAll(updateItems, function() {
          CartItem.create(createItems).then(function(createdItems) {
            var itemIds = []
            updateItems.forEach(function(item) {
              itemIds.push(item.id)
            })
            createdItems.forEach(function(item) {
              itemIds.push(item.id)
            })
            Quote.update({
              id: cart.quote.id
            }, quote).then(function(q) {
              Cart.update({
                sessionId: session.idx
              }, {
                items: itemIds
              }).then(function() {
                Cart.findOne({
                    sessionId: session.idx
                  })
                  .populate('items', {
                    select: CartItem.populateFields
                  })
                  .populate('quote', {
                    select: Quote.populateFields
                  })
                  .then(function(newcart) {
                    callback && callback(newcart)
                  })
              })
            })
          })
        })
      })
    }
  }
};
