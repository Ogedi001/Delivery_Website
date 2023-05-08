const Customer = require('./../models/cus.reg.model')
const jwt = require('jsonwebtoken');

const getCustomerOrders = (req, res) => {
    res.status(201).render('customer_orders')
}

module.exports = { getCustomerOrders }