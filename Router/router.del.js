const router = require('express').Router();
const { getHome, getSignUP } = require('./../Controller/customer&Rider.controller');
const { RegCustomer } = require('./../Controller/customer.controller');

router.get('/home', getHome);
router.get('/signup/:signUpType', getSignUP);
router.post('/signup/customer', RegCustomer);

//     const { username, name, email, password, passwordConfirmation, address, phoneNumber } = req.body



//     try {

//         // Check that passwords match
//         if (password !== passwordConfirmation) {
//             return res.status(400).render('signup_customer', { passwordMSG: 'Passwords do not match' });
//         } else {
//             return res.render('signup_customer', { passwordMSG: null });
//         }


//         // Hash password before saving
//         const saltRounds = 10;
//         const salt = await bcrypt.genSalt(saltRounds);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create new customer object
//         const newCustomer = new customer({
//             username: username,
//             name: name,
//             email: email,
//             password: hashedPassword,
//             address: address,
//             phoneNumber: phoneNumber
//         });

//         // Save customer to database
//         await newCustomer.save();

//         console.log('Customer saved to database');
//         res.status(201).send({ message: 'Customer account created successfully' });
//     }
//     catch (error) {

//       // Define errors object before checking for duplicate key error
// const errors = {};

//       // Check for duplicate key error
//       if (error.name === 'MongoError' && error.code === 11000) {

//         if (error.keyValue.username) {
//           errors.username = 'Username already exists';
//         }
//         if (error.keyValue.email) {
//           errors.email = 'Email already exists';
//         }
//         if (error.keyValue.phoneNumber) {
//           errors.phoneNumber = 'Phone number already exists';
//         }
//         // Pass errors object to view
//         res.status(400).render('signup_customer', { errors: errors, username: username, email: email, phoneNumber: phone });

//       } else {
//         console.error(error);
//         res.status(500).send({ message: 'An error occurred while creating the customer account' });
//       }

// if (error.name === "ValidationError") {
//     console.log(JSON.stringify(error))
//     const errors = {};
//     Object.keys(error.errors).forEach(field => {
//         return errors[field] = error.errors[field].message
//     });

//     res.render('signup_customer', { errors: errors })
//     return
//         // }
//     }
// });


module.exports = router