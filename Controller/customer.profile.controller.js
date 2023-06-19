const Customer = require('./../models/cus.reg.model')
const jwt = require('jsonwebtoken');
const multer = require('multer')
const bcrypt = require('bcrypt')
const fs = require('fs');
const path = require('path');



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
    res.status(201).render('customer_profileUpdate', { passwordError: null, value: null, successMessage: null })
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
                res.status(201).json({ Message: " Profile picture uploaded successfully" })
                return;
            }
            catch (error) {
                console.log(error)
                return res.status(500).send('Error 500 : Internal server error ')
            }
        }

        console.log(error)
    }

    );
}
const removeProfilePICS = async (req, res) => {
    const token = req.cookies.customer;
    jwt.verify(token, 'JWT', async (error, decoded) => {
        if (!error) {
            try {
                const customerId = decoded.id;
                const customer = await Customer.findById(customerId);

                if (customer.profile_pic) {
                    const relativeFilePath = customer.profile_pic.data.toString();
                    console.log(relativeFilePath)
                    const absoluteFilePath = path.join('./', 'public', 'uploads', relativeFilePath);
                    console.log(absoluteFilePath)

                    // Delete the profile picture file from the filesystem
                    fs.unlinkSync(absoluteFilePath);

                    // Remove the profile picture reference from the customer document
                    customer.profile_pic = null;
                    await customer.save();
                    res.status(201).json({ Message: " Profile picture removed successfully" })
                    return;
                }

                res.sendStatus(200);
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: 'An error occurred while removing the profile picture.' });
            }
        } else {
            console.log(error);
            res.status(401).json({ error: 'Unauthorized' });
        }
    });
};



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

            res.status(201).json({ Message: 'Email updated successfully!' })

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

            res.status(201).json({ Message: 'Phone number updated successfully!' })

            return
        }
        console.log(JSON.stringify(error))
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

            res.status(201).json({ Message: 'Address updated successfully!' })

            return
        }
        console.log(JSON.stringify(error))
    })
}
const changePassword = async (req, res) => {
    const { current_password, new_password, confirm_password } = req.body
    const token = req.cookies.customer
    jwt.verify(token, 'JWT', async (error, decoded) => {

        try {
            if (!error) {
                const customer = await Customer.findById(decoded.id)
                console.log(current_password)
                const isvalid = bcrypt.compareSync(current_password, customer.password)
                console.log(isvalid)
                if (!isvalid) {

                    return res.status(400).json({ Message: 'current password is incorrect' })

                }
                if (new_password !== confirm_password) {
                    return res.status(400).json({ Message: 'New password and confirm password do not match' });
                }
                customer.password = new_password
                await customer.save()

                return res.status(200).json({ Message: 'Password updated successfully' });

            }
        } catch (error) {
            const Error = error.errors.password.message

            //console.log(JSON.stringify(error))
            res.status(400).json({ Message: Error })
        }


        console.log(error)
    })
}
const reloadPage = (req, res) => {
    res.redirect('/customer/profileUpdate')
}

module.exports = { getCustomerProfile, uploadProfilePics, upload, updateEmail, updatePhoneNumber, updateAddress, removeProfilePICS, changePassword, reloadPage }







