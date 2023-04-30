require('dotenv').config()
const jwt = require('jsonwebtoken');
const Customer = require('./../models/cus.reg.model')




const customerAuth = (req, res, next) => {

    const token = req.cookies.customer
    if (!token) {
        res.redirect('/login');
        return;
    }

    jwt.verify(token, 'JWT', (error, decoded) => {
        if (!error) {
            next();
            return;
        }
        console.log(error);
        res.redirect('/login');
    });

};
const checkCustomer = (req, res, next) => {
    const token = req.cookies.customer
    if (!token) {
        res.locals.customer = null
        next()
        return
    }
    jwt.verify(token, 'JWT', async (error, decoded) => {
        if (!error) {
            const customer = await Customer.findById(decoded.id)
            res.locals.customer = customer
            next();
            return;
        }
        console.log(error)
        res.locals.customer = null
        next()
    });


}

module.exports = { customerAuth, checkCustomer }
