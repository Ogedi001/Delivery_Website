const Customer = require('./../models/cus.reg.model')
const jwt = require('jsonwebtoken');

const getCustomerProfile = async (req, res) => {
    // try {
    //     const customer = await Customer.findOne({ username: req.session.customer });
    //     await customer.updateAge(30);
    console.log(req.cookies)

    const token = req.cookies.customer

    jwt.verify(token, 'JWT', async (error, decoded) => {
        if (!error) {
            const customer = await Customer.findById(decoded.id)
            console.log(customer.email + customer.phoneNumber)
            await customer.updateAge(30)
            console.log('data updated')
            return;
        }
        console.log(error)
    }
    );



    res.status(201).render('customer_profile')
}

module.exports = { getCustomerProfile }





// const Customer = require('../models/customer');

// const getCustomerProfile =  (req, res) => {
//   try {
//     const customer = await Customer.findOne({ username: 'John' });
//     await customer.updateAge(30);
//     res.status(201).render('customer_profile');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error updating customer age');
//   }
// };

