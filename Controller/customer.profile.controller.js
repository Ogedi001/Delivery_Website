const Customer = require('./../models/cus.reg.model')
const jwt = require('jsonwebtoken');
const multer = require('multer')


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

    res.status(201).render('customer_profile')
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

module.exports = { getCustomerProfile, uploadProfilePics, upload }







