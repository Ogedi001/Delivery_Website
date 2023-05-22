const Customer = require('./../models/cus.reg.model')
const Order = require('./../models/cus.order.model')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const axios = require('axios');


const BingApiKey = 'AqoGN0E0UWeq7zFB8DruRzIzqNgQZb862e00WsMjQy7hVPRivBv8PPk31dVRi5uG';


const validateAddress = async (address) => {
    try {
        const response = await axios.get('https://dev.virtualearth.net/REST/v1/Locations', {
            params: {
                q: address,
                key: BingApiKey,
            },
        });

        const results = response.data.resourceSets[0].resources;

        if (results.length > 0) {
            const validAddress = results[0].name;
            return { valid: true, validAddress };
        }

        return { valid: false };
    } catch (error) {
        console.error('Address validation error:', error);
        throw error;
    }
};

const postCustomerOrders = async (req, res) => {
    const { pickupLocation, dropoffLocation, pickupSearchBox, dropoffSearchBox } = req.body;

    try {
        // Validate pickup address
        const pickupValidationResult = await validateAddress(pickupSearchBox);

        if (!pickupValidationResult.valid) {
            return res.status(400).json({ error: 'Invalid pickup address' });
        }

        // Validate dropoff address
        const dropoffValidationResult = await validateAddress(dropoffSearchBox);

        if (!dropoffValidationResult.valid) {
            return res.status(400).json({ error: 'Invalid dropoff address' });
        }

        // Both addresses are valid, proceed with order processing
        // ...

        return res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Address validation error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


const getCustomerOrders = (req, res) => {
    const data = {
        bingMapsKey: BingApiKey
    };
    res.status(201).render('customer_orders', data)
}



// const postCustomerOrders = async (req, res) => {
//     const { pickupLocation, dropoffLocation, pickupSearchBox, dropoffSearchBox } = req.body;

//     console.log(pickupLocation);
//     console.log(pickupSearchBox);
//     console.log(dropoffLocation);
//     console.log(dropoffSearchBox);

//     try {
//         // Validate pickup address
//         const pickupValidationResult = await validateAddress(pickupLocation, pickupSearchBox);

//         if (!pickupValidationResult.valid) {
//             return res.status(400).json({ error: 'Invalid pickup address' });
//         }

//         // Validate dropoff address
//         const dropoffValidationResult = await validateAddress(dropoffLocation, dropoffSearchBox);
//         console.log(req.body.dropoffSearchBox)
//         if (!dropoffValidationResult.valid) {
//             return res.status(400).json({ error: 'Invalid dropoff address' });
//         }

//         // Both addresses are valid, proceed with order processing
//         // ...

//         return res.status(200).json({ message: 'Order placed successfully' });
//     } catch (error) {
//         console.error('Address validation error:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Function to validate an address using Bing Maps API
// const validateAddress = async (address, suggestedAddress) => {
//     try {
//         const response = await axios.get('https://dev.virtualearth.net/REST/v1/Locations', {
//             params: {
//                 q: address,
//                 key: BingApiKey,
//             },
//         });

//         // Check if the address is valid based on the API response
//         const results = response.data.resourceSets[0].resources;
//         const valid = results.some((result) => {
//             console.log(result);
//             console.log(result.name + "hhhh");
//             console.log(suggestedAddress)
//             return result.name === suggestedAddress
//         });

//         return { valid, results };
//     } catch (error) {
//         console.error('Address validation error:', error);
//         throw error;
//     }
// };


//     const uuid = uuidv4();
//     const uuidArray = uuid.split('-');
//     const orderNumber = `${uuidArray[0]}${uuidArray[1]}`.toUpperCase();
//     console.log(orderNumber);

//     const token = req.cookies.customer;
//     jwt.verify(token, 'JWT', async (error, decoded) => {
//         if (!error) {
//             try {
//                 if (!decoded) {
//                     return res.status(401).json({ error: 'Unauthorized' });
//                 }
//                 const customerId = decoded.id;
//                 const order = new Order({
//                     customer: customerId,
//                     orderNumber,
//                     ...req.body
//                 });
//                 console.log(order)
//                 const newOrder = await Order.create(order)
//                 const populatedOrder = await Order.findById(newOrder._id).populate('customer');
//                 res.status(201).json(populatedOrder);
//             } catch (error) {
//                 console.log(error);
//                 res.status(500).json({ error: 'Internal server error' });
//             }
//         } else {
//             console.log(error);
//             res.status(401).json({ error: 'Unauthorized' });
//         }
//     });
//};


module.exports = { getCustomerOrders, postCustomerOrders }