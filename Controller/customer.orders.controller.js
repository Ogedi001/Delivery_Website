require('dotenv').config()
const Customer = require('./../models/cus.reg.model')
const Order = require('./../models/cus.order.model')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const axios = require('axios');

const BingApiKey = process.env.BingApiKey



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
            const coordinates = results[0].point.coordinates; // Extract the coordinates from the response
            return { valid: true, validAddress, coordinates };
        }

        return { valid: false };
    } catch (error) {
        console.error('Address validation error:', error);
        throw error;
    }
};
const calculateDistanceAndTime = async (lat1, lon1, lat2, lon2) => {
    try {
        const response = await axios.get('https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix', {
            params: {
                origins: `${lat1},${lon1}`,
                destinations: `${lat2},${lon2}`,
                travelMode: 'driving',
                key: BingApiKey
            }
        });

        const distanceMatrix = response.data.resourceSets[0].resources[0].results[0];
        const travelDistance = distanceMatrix.travelDistance;
        const travelDuration = distanceMatrix.travelDuration;

        // Use the retrieved distance and duration for further processing or calculations
        return { travelDistance, travelDuration }

    } catch (error) {
        console.error('Error calculating distance:', error);
    }
};
const calculateOrderAmount = (distance, time) => {
    // Assuming a simple pricing model: $1 per kilometer and $0.10 per minute
    const pricePerKilometer = 200;
    const pricePerMinute = 10;

    const distanceCost = distance * pricePerKilometer;
    const timeCost = time * pricePerMinute;

    // Add any additional fees or calculations based on your specific business logic

    // Calculate the total order amount
    const orderAmount = distanceCost + timeCost;

    return orderAmount;
};





const postCustomerOrders = async (req, res) => {
    const uuid = uuidv4();
    const uuidArray = uuid.split('-');
    const orderNumber = `${uuidArray[0]}${uuidArray[1]}`.toUpperCase();
    console.log(orderNumber);
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
        const pickupCoordinates = pickupValidationResult.coordinates;
        const dropoffCoordinates = dropoffValidationResult.coordinates;


        console.log(pickupCoordinates);
        console.log(dropoffCoordinates);
        // Calculate distance and time between pickup and dropoff using a mapping service or API
        const distanceAndTime = await calculateDistanceAndTime(pickupCoordinates[0], pickupCoordinates[1], dropoffCoordinates[0], dropoffCoordinates[0])

        const distance_km = distanceAndTime.travelDistance;
        const time_mins = distanceAndTime.travelDuration;


        console.log(`${distance_km}km`);
        console.log(`${time_mins}mins`);
        console.log(calculateOrderAmount(distance_km, time_mins))
        const OrderAmount = calculateOrderAmount(distance_km, time_mins)

        // const time = await calculateTime(pickupCoordinates, dropoffCoordinates);

        const token = req.cookies.customer;
        jwt.verify(token, 'JWT', async (error, decoded) => {
            if (!error) {
                try {
                    if (!decoded) {
                        return res.status(401).json({ error: 'Unauthorized' });
                    }
                    const customerId = decoded.id;
                    const order = new Order({
                        customer: customerId,
                        OrderDuration: { distance_km, time_mins },
                        OrderAmount,
                        orderNumber,
                        ...req.body
                    });
                    console.log(order)
                    const newOrder = await Order.create(order)
                    const populatedOrder = await Order.findById(newOrder._id).populate('customer');

                    return res.status(200).json({ message: 'Order placed successfully', populatedOrder });

                } catch (error) {
                    console.log(error);
                    res.status(500).json({ error: 'Internal server error' });
                }
            }

            else {
                console.log(error);
                res.status(401).json({ error: 'Unauthorized' });
            };
        })

    } catch (error) {
        console.error('Address validation error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const getCustomerOrders = (req, res) => {
    const data = {
        bingMapsKey: BingApiKey
    };
    const token = req.cookies.customer;
    jwt.verify(token, 'JWT', async (error, decoded) => {
        if (!error) {
            try {
                if (!decoded) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                const customer = await Customer.findById(decoded.id)
                console.log(customer)
                if (customer) {
                    const orders = await Order.find({ customer: decoded.id })
                    return res.status(201).render('customer_orders', { ...data, orders })
                }
            } catch (error) {
                console.log(error)
            }
        }
    })
}

const order = (req, res) => {
    const { id } = req.query
    const token = req.cookies.customer;
    jwt.verify(token, 'JWT', async (error, decoded) => {
        if (!error) {
            try {
                if (!decoded) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                const customer = await Customer.findById(decoded.id)
                console.log(customer)
                if (customer) {
                    const order = await Order.findOne({ _id: id, customer: decoded.id })
                    console.log(order)
                    return res.status(201).render('order', { order })
                }
            } catch (error) {
                console.log(error)
            }
        }
    })
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


module.exports = { getCustomerOrders, postCustomerOrders, order }