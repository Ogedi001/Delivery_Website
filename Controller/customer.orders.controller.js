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
        throw error
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
            console.log(JSON.stringify)
            return res.status(400).json({ error: 'Invalid pickoff address' });
        }

        // Validate dropoff address
        const dropoffValidationResult = await validateAddress(dropoffSearchBox);

        if (!dropoffValidationResult.valid) {
            return res.status(400).json({ error: 'Invalid dropoff address' });
        }


        // Both addresses are valid, proceed with order processing
        const pickupCoordinates = pickupValidationResult.coordinates;
        const dropoffCoordinates = dropoffValidationResult.coordinates;


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

                if (!decoded) {
                    return res.status(401).redirect('/login');
                }
                const customerId = decoded.id;
                const order = new Order({
                    customer: customerId,
                    OrderDuration: { distance_km, time_mins },
                    OrderAmount,
                    orderNumber,
                    ...req.body
                });
                //try saving neew order
                try {
                    const newOrder = await Order.create(order)
                    const populatedOrder = await Order.findById(newOrder._id).populate('customer');
                    console.log(populatedOrder)
                    return res.status(200).json({ message: 'Order placed successfully', populatedOrder });
                    //catch error if theres any
                } catch (error) {
                    console.log(JSON.stringify(error));
                    if (error.name === "ValidationError") {
                        const itemTypeError = error.errors.itemType.message
                        console.log(itemTypeError)

                        return res.status(401).json({ itemTypeError: itemTypeError });
                    }
                    console.log(error);
                    return res.status(500).json({ error: 'An unexpected error occurred' });
                }
            } else {
                return res.status(401).redirect('/login');
            };
        })

    } catch (error) {
        if (error.name === 'AxiosError') {
            res.status(401).json({ validError: 'Please select valid pickoff and dropoff addresses' })
        }
        return console.log(JSON.stringify(error));

    }
}



// const postCustomerOrders = async (req, res) => {
//     const uuid = uuidv4();
//     const uuidArray = uuid.split('-');
//     const orderNumber = `${uuidArray[0]}${uuidArray[1]}`.toUpperCase();
//     console.log(orderNumber);
//     const { pickupLocation, dropoffLocation, pickupSearchBox, dropoffSearchBox } = req.body;

//     try {
//         // Validate pickup address
//         const pickupValidationResult = await validateAddress(pickupSearchBox);

//         if (!pickupValidationResult.valid) {
//             console.log(JSON.stringify)
//             return res.status(400).json(JSON.stringify(error));
//         }

//         // Validate dropoff address
//         const dropoffValidationResult = await validateAddress(dropoffSearchBox);

//         if (!dropoffValidationResult.valid) {
//             return res.status(400).json({ error: 'Invalid dropoff address' });
//         }


//         // Both addresses are valid, proceed with order processing
//         const pickupCoordinates = pickupValidationResult.coordinates;
//         const dropoffCoordinates = dropoffValidationResult.coordinates;


//         // Calculate distance and time between pickup and dropoff using a mapping service or API
//         const distanceAndTime = await calculateDistanceAndTime(pickupCoordinates[0], pickupCoordinates[1], dropoffCoordinates[0], dropoffCoordinates[0])

//         const distance_km = distanceAndTime.travelDistance;
//         const time_mins = distanceAndTime.travelDuration;


//         console.log(`${distance_km}km`);
//         console.log(`${time_mins}mins`);
//         console.log(calculateOrderAmount(distance_km, time_mins))
//         const OrderAmount = calculateOrderAmount(distance_km, time_mins)

//         // const time = await calculateTime(pickupCoordinates, dropoffCoordinates);

//         const token = req.cookies.customer;
//         jwt.verify(token, 'JWT', async (error, decoded) => {
//             if (!error) {

//                 if (!decoded) {
//                     return res.status(401).redirect('/login');
//                 }
//                 const customerId = decoded.id;
//                 const order = new Order({
//                     customer: customerId,
//                     OrderDuration: { distance_km, time_mins },
//                     OrderAmount,
//                     orderNumber,
//                     ...req.body
//                 });
//                 //try saving neew order
//                 try {
//                     const newOrder = await Order.create(order)
//                     const populatedOrder = await Order.findById(newOrder._id).populate('customer');

//                     return res.status(200).json({ message: 'Order placed successfully', populatedOrder });
//                     //catch error if theres any
//                 } catch (error) {
//                     console.log(JSON.stringify(error));
//                     if (error.name === "ValidationError") {
//                         const itemTypeError = error.errors.itemType.message
//                         console.log(itemTypeError)

//                         const customer = await Customer.findById(customerId)

//                         if (customer) {
//                             const orders = await Order.find({ customer: customerId })
//                             return res.status(500).render('customer_orders', { validError: itemTypeError, bingMapsKey: BingApiKey, orders })
//                         }

//                     }
//                     console.log(error)
//                     return res.status(500).json({ error: 'Internal server error' });
//                 }
//             } else {
//                 return res.status(401).redirect('/login');
//             };
//         })

//     } catch (error) {
//         if (error.name === 'AxiosError') {
//             const token = req.cookies.customer;
//             jwt.verify(token, 'JWT', async (error, decoded) => {
//                 if (!error) {

//                     if (!decoded) {
//                         return res.status(401).json({ error: 'Unauthorized' });
//                     }
//                     const customer = await Customer.findById(decoded.id)
//                     console.log(customer)
//                     if (customer) {
//                         const orders = await Order.find({ customer: decoded.id })
//                         return res.status(500).render('customer_orders', { validError: 'Please select valid pickoff and dropoff addresses', bingMapsKey: BingApiKey, orders })
//                     }
//                     return res.status(401).redirect('/login');
//                 }
//                 return res.status(401).redirect('/login');
//             })
//         }
//         return console.log(JSON.stringify(error));

//     }
// }



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

                if (customer) {
                    const orders = await Order.find({ customer: decoded.id })
                    return res.status(201).render('customer_orders', { ...data, orders, validError: null })
                }
            } catch (error) {
                console.log(error)
            }
        }
    })
}

const AllOrders = (req, res) => {
    const token = req.cookies.customer;
    jwt.verify(token, 'JWT', async (error, decoded) => {
        if (!error) {
            try {
                if (!decoded) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                const customer = await Customer.findById(decoded.id)

                if (customer) {
                    const orders = await Order.find({ customer: decoded.id })
                    return res.status(201).render('order_history', { orders })
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

const deleteOrder = (req, res) => {
    const { id } = req.query;
    const token = req.cookies.customer;
    jwt.verify(token, 'JWT', async (error, decoded) => {
        if (!error) {
            try {
                if (!decoded) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                const customer = await Customer.findById(decoded.id);
                console.log(customer);
                if (customer) {
                    const deletedOrder = await Order.deleteOne({ _id: id, customer: decoded.id });
                    console.log(deletedOrder);
                    return res.status(200).json({ message: 'Order deleted successfully' });
                }
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    });
};




module.exports = { getCustomerOrders, postCustomerOrders, order, AllOrders, deleteOrder }