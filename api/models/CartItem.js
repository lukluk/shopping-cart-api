/**
 * CartItem.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
'use strict'

function updateNext(items,callback,n){
  if(!n) n = 0
  if(n>=items.length){
    callback && callback()
  }else
  CartItem.update({id:items[n].id},items[n]).then(function(){
    let next = n + 1
    updateNext(items,callback,next)
  })
}
function populateProduct(items,callback,n){
  if(!n) n = 0
  if(n>=items.length){
    callback && callback(items)
  }else
  Product.findOne({SKU:items[n].SKU.trim()})
  .populate('price',{select:Price.populateFields})
  .then(function(product){
    let next = n + 1
    items[n].product = product
    populateProduct(items,callback,next)
  })
}
module.exports = {
  populateFields: ['SKU', 'qty'],
  updateAll: function(items,callback){
    updateNext(items, callback)
  },
  populateItems: function(items,callback){
    populateProduct(items,callback)
  },
  attributes: {
    SKU: {
      type: 'string'
    },
    qty: {
      type: 'integer',
      defaultsTo: '1'
    },
    options: {
      type: 'string'
    }
  }
};
