const Customer = require('./../models/cus.reg.model')


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
        res.status(201).send({ message: 'Customer account created successfully' });
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

            return res.status(400).render('signup_customer', { errors: errors, value: req.body, passwordMSG: null });
        }

        if (error.name === 'ValidationError') {
            const invalidErrors = {}
            Object.values(error.errors).forEach(err => {
                invalidErrors[err.path] = err.message
            })
            console.log(invalidErrors)
            return res.status(400).render('signup_customer', { errors: null, value: req.body, passwordMSG: null, invalidErrors: invalidErrors })
        }

        else {

            res.status(500).render('signup_customer', { message: 'An error occurred while creating the customer account' });
        }

        console.log(JSON.stringify(error))
        res.json(JSON.stringify(error))
    }
}




module.exports = { RegCustomer }