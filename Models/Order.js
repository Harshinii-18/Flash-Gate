const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
  user : {
    type : mongoose.Types.ObjectId,
    ref : 'User',
    required : [true, 'Provide user']
  },
  product : {
    type : mongoose.Types.ObjectId,
    ref : 'Product',
    required : [true, 'Provide product']
  },
  quantity : {
    type : Number,
    min : 1,
    default : 1
  },
  totalPrice : {
    type : Number,
    min : 0,
    required : [true, 'Provide total price']
  }

}, {timestamps : true})

module.exports = mongoose.model("Order", OrderSchema)
