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
        default: () => new Date().toLocaleTimeString('en-US', { month: 'short', day: 'numeric' })
    },

    OrderDuration: {
        distance_km: {
            type: Number,
            required: true
        },
        time_mins: {
            type: Number,
            required: true
        }
    },
    OrderAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'In Progress', 'Delivered'],
        default: 'Pending'
    },
    pickupLocation: {
        type: String,
        required: [true, "valid pick up address is required"]
    },
    dropoffLocation: {
        type: String,
        required: [true, "valid droff off address is required"]

    },
    itemType: {
        type: String,
        enum: ['Groceries', 'Accessories', 'Books', 'Clothes', 'Electronics', 'Furniture', 'Other'],
        required: [true, 'Please select the Item type']
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