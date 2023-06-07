const Customer = require('./../models/cus.reg.model')
const jwt = require('jsonwebtoken')

const createToken = (id) => {
    const Time_in = new Date().toLocaleTimeString();

    return jwt.sign({ id, Time_in }, 'JWT')
}

const RegCustomer = async (req, res) => {
    try {
        const { password, passwordConfirmation } = req.body
        if (!password) {
            return res.status(400).render('signup_customer', { passwordMSG: 'Passwords field can not be empty', value: req.body, errors: null, invalidErrors: null });
        }
        if (password !== passwordConfirmation) {
            return res.status(400).render('signup_customer', { passwordMSG: 'Passwords do not match', value: req.body, errors: null, invalidErrors: null });
        }
        // code for special validating email and phone number receiving sms and mail
        const customer = await Customer.create(req.body)
        console.log('Customer saved to database');
        const token = createToken(customer._id)
        res.cookie('customer', token, { httpOnly: true })
        res.status(201).redirect('/customer')
    }

    catch (error) {

        if (error.code === 11000) {
            const errors = {};
            if (error.keyPattern.username) {
                errors.username = 'Username already exist'
                console.log(errors.username)

            }
            if (error.keyPattern.email) {
                errors.email = 'Email address already exists';
                console.log(errors.email)
            }
            if (error.keyPattern.phoneNumber) {
                errors.phoneNumber = 'Phone number already exists';
                console.log(errors.phoneNumber)

            }
            console.log(errors)

            return res.status(400).render('signup_customer', { errors, value: req.body, passwordMSG: null, invalidErrors: null });

        }

        if (error.name === 'ValidationError') {
            const invalidErrors = {}
            Object.values(error.errors).forEach(err => {
                invalidErrors[err.path] = err.message
            })
            console.log(invalidErrors)
            return res.status(400).render('signup_customer', { errors: null, value: req.body, passwordMSG: null, invalidErrors })
        }

        else {

            res.status(500).render('signup_customer', { message: 'An error occurred while creating the customer account' });
        }

        console.log(JSON.stringify(error))
        res.json(JSON.stringify(error))
    }
}


const getLogin = (req, res) => {
    res.render('login_customer', { error: null, value: null })
}
const login = async (req, res) => {

    const { email_username, password } = req.body
    try {
        const user = await Customer.findUserByEmailOrUsername(email_username, password)

        const token = createToken(user._id)
        res.cookie('customer', token, { httpOnly: true })
        res.status(201).redirect('/customer')

    } catch (error) {
        console.log(error)
        res.render('login_customer', { error: error, value: req.body })
    }
}
const getCustomer = (req, res) => {
    res.status(201).render('customer')
}

const logOut = (req, res) => {
    res.cookie('customer', '', { maxAge: 1 })
    res.redirect('/login')

}



module.exports = { RegCustomer, getLogin, login, getCustomer, logOut }