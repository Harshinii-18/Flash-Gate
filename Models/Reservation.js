const mongoose = require('mongoose')

const ReservationSchema = new mongoose.Schema({
  user : {
    type : mongoose.Types.ObjectId,
    required : [true, 'Provide user'],
    ref : "User"
  },
  product : {
    type : mongoose.Types.ObjectId,
    required: [true, 'Provide product id'],
    ref : "Product"
  },
  quantity : {
    type : Number,
    min : 1
  },
  status :{
    type : String,
    enum : ['ACTIVE', 'EXPIRED', 'COMPLETED'],
    deafult : "ACTIVE"
  },
  expiresAt : {
    type : Date,
    required : true
    //index : true
  }
},{timestamps : true})

// indexes for performance
// ReservationSchema.index({ user: 1, product: 1 })
// ReservationSchema.index({ product: 1, status: 1 })

module.exports = mongoose.model('Reservation',ReservationSchema)