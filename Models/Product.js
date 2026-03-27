const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  name : {
    type : String,
    required : [true, 'Product name is required'],
    minlength : 5,
    maxlength : 30
  },
  price : {
    type : Number,
    required : [true, 'Product price is required'],
    min : 0
  },
  stock :{
    type : Number,
    min : 0,
    default : 0 
  },
  flashSaleStart : {
    type : Date,
    required : [true, 'Flash sale start date is required']
  },
  flashSaleEnd : {
    type : Date,
    required : [true, 'Flash sale end date is required']
  },
  createdBy : {
    type : mongoose.Types.ObjectId,
    ref : 'User',
    required : [true, 'Provide admin']
  }

}, {timestamps : true})

module.exports = mongoose.model('Product', ProductSchema)
