const Customer = require('./../models/cus.reg.model')
const jwt = require('jsonwebtoken');
const multer = require('multer')
const bcrypt = require('bcrypt')


// Set storage engine for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads'); // Save uploaded files to 'uploads' folder in the root directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const upload = multer({ storage: storage })

const getCustomerProfile = (req, res) => {
    res.status(201).render('customer_profile', { passwordError: null, value: null, successMessage: null })
}


const uploadProfilePics = (req, res) => {

    console.log(req.file)

    const token = req.cookies.customer
    jwt.verify(token, 'JWT', async (error, decoded) => {
        if (!error) {
            try {
                const customer = await Customer.findById(decoded.id)
                //         console.log(customer)

                customer.profile_pic = {
                    data: req.file.filename,
                    contentType: 'image/png'
                }
                await customer.save()
                console.log('image uploaded successfully')
                res.redirect('/customer/profile')
                return;
            }
            catch (error) {
                console.log(error)
                res.status(500).send('Internal server error')
            }
        }

        console.log(error)
    }

    );
}
const removeProfilePICS = async (req, res) => {
    const token = req.cookies.customer
    jwt.verify(token, 'JWT', async (error, decoded) => {
        if (!error) {
            const customer = await Customer.findById(decoded.id)
            customer.profile_pic = null
            await customer.save()
            res.redirect('/customer/profile')
            return
        }
        console.log(error)
    })
}

const updateEmail = async (req, res) => {
    const { newEmail } = req.body
    const token = req.cookies.customer
    jwt.verify(token, 'JWT', async (error, decoded) => {
        if (!error) {
            const customer = await Customer.findById(decoded.id)
            console.log(customer.email)
            customer.email = newEmail
            await customer.save()
            console.log('email updated successfully')

            res.status(201).render('customer_profile', { passwordError: null, value: null, successMessage: 'email updated successfully!' })

            return
        }
        console.log(error)
    })
}
const updatePhoneNumber = (req, res) => {
    const { newPhone } = req.body
    console.log(newPhone)
    const token = req.cookies.customer
    jwt.verify(token, 'JWT', async (error, decoded) => {
        if (!error) {
            const customer = await Customer.findById(decoded.id)

            customer.phoneNumber = newPhone
            await customer.save()

            res.status(201).render('customer_profile', { passwordError: null, value: null, successMessage: 'Phone number updated successfully!' })

            return
        }
        console.log(error)
    })
}
const updateAddress = (req, res) => {
    const { newAddress } = req.body
    const token = req.cookies.customer
    jwt.verify(token, 'JWT', async (error, decoded) => {
        if (!error) {
            const customer = await Customer.findById(decoded.id)
            customer.address = newAddress
            await customer.save()

            res.status(201).render('customer_profile', { passwordError: null, value: null, successMessage: 'Address updated successfully!' })

            return
        }
        console.log(error)
    })
}
const changePassword = async (req, res) => {
    const { current_password, new_password, confirm_password } = req.body
    const token = req.cookies.customer
    jwt.verify(token, 'JWT', async (error, decoded) => {

        try {
            if (!error) {
                const customer = await Customer.findById(decoded.id)
                const isvalid = bcrypt.compareSync(current_password, customer.password)
                console.log(isvalid)
                if (!isvalid) {

                    res.status(400).render('customer_profile', { passwordError: 'current password is incorrect', value: null, successMessage: null })
                    return
                }
                if (new_password !== confirm_password) {
                    res.status(400).render('customer_profile', { passwordError: 'password do not match', value: req.body, successMessage: null })
                    return
                }
                customer.password = new_password
                await customer.save()

                res.status(201).render('customer_profile', { passwordError: null, value: null, successMessage: 'Password updated successfully!' })

                return
            }
        } catch (error) {
            const Error = error.errors.password.message

            //console.log(JSON.stringify(error))
            res.status(400).render('customer_profile', { passwordError: Error, value: req.body, successMessage: null })
        }


        console.log(error)
    })
}
const reloadPage = (req, res) => {
    res.redirect('/customer/profile')
}

module.exports = { getCustomerProfile, uploadProfilePics, upload, updateEmail, updatePhoneNumber, updateAddress, removeProfilePICS, changePassword, reloadPage }







