const router = require('express').Router();
const multer = require('multer')
const { getHome, getSignUP } = require('./../Controller/customer&Rider.controller');
const { RegCustomer, getLogin, login, getCustomer, logOut } = require('./../Controller/customer.controller');
const { customerAuth, checkCustomer } = require('./../Middleware/customerAuth')
const { getCustomerProfile, uploadProfilePics, upload, updateEmail, updatePhoneNumber, updateAddress, removeProfilePICS, changePassword, reloadPage } = require('./../Controller/customer.profile.controller')
const { getCustomerOrders, postCustomerOrders, order, AllOrders, deleteOrder } = require('./../Controller/customer.orders.controller')


router.get('*', checkCustomer)
router.post('*', checkCustomer)
router.get('/', getHome);
router.get('/signup/:signUpType', getSignUP);
router.post('/signup/customer', RegCustomer);
router.get('/login', getLogin),
    router.post('/login', login)
router.get('/customer', customerAuth, getCustomer)
router.get('/customer/signout', logOut)


router.get('/customer/profile', getCustomerProfile)
router.get('/customer/profile/update-profile-pic', upload.single('profile_pic'), reloadPage)
router.get("/customer/profile/remove-profile-pic", reloadPage)
router.get('/customer/profile/update-email', reloadPage)
router.get("/customer/profile/update-phone", reloadPage)
router.get("/customer/profile/update-address", reloadPage)
router.get("/customer/profile/update-password", reloadPage)


router.post('/customer/profile/update-profile-pic', upload.single('profile_pic'), uploadProfilePics)
router.post("/customer/profile/remove-profile-pic", removeProfilePICS)
router.post('/customer/profile/update-email', updateEmail)
router.post("/customer/profile/update-phone", updatePhoneNumber)
router.post("/customer/profile/update-address", updateAddress)
router.post("/customer/profile/update-password", changePassword)


router.get('/customer/orders', getCustomerOrders)
router.get('/customer/order', order)
router.get('/customer/orders-all', AllOrders)
router.post("/orders", postCustomerOrders)
router.delete('/order/delete', deleteOrder)
module.exports = router