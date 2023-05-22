const Customer = require('./../models/cus.reg.model')
const mongoose = require('mongoose'),
    { Schema } = mongoose,
    bcrypt = require('bcrypt'),
    validator = require('validator')



const OrderSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    orderDate: {
        type: String,
        required: true,
        default: new Date().toLocaleTimeString('en-US', { month: 'short' })
    },

    // totalAmount: {
    //     type: Number,
    //     required: true
    // },
    orderStatus: {
        type: String,
        enum: ['Pending', 'In Progress', 'Delivered'],
        default: 'Pending'
    },
    pickupLocation: {
        type: String,
        required: true
    },
    dropoffLocation: {
        type: String,
        required: true
    },
    itemType: {
        type: String,
        enum: ['Groceries', 'Accessories', 'Books', 'Clothes', 'Electronics', 'Furniture', 'Other'],
        required: true
    },
    itemImage: {
        type: String
    },
    deliveryOption: {
        type: String,
        enum: ['Standard', 'Express'],
        required: true
    },
    paymentOption: {
        type: String,
        enum: ['Credit/Debit Card', 'PayPal'],
        required: true
    },

})


const customerOrder = mongoose.model('Order', OrderSchema)

module.exports = customerOrder;