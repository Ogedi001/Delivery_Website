const router = require('express').Router();
const { getHome, getSignUP } = require('./../Controller/customer&Rider.controller');
const { RegCustomer, getLogin, login, getCustomer, logOut } = require('./../Controller/customer.controller');
const { customerAuth, checkCustomer } = require('./../Middleware/customerAuth')
const { getCustomerProfile } = require('./../Controller/customer.profile.controller')

router.get('*', checkCustomer)
router.get('/home', getHome);
router.get('/signup/:signUpType', getSignUP);
router.post('/signup/customer', RegCustomer);
router.get('/login', getLogin),
    router.post('/login', login)
router.get('/customer', customerAuth, getCustomer)
router.get('/customer/signout', logOut)
router.get('/customer/profile', getCustomerProfile)



module.exports = router