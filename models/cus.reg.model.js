const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    validator = require('validator')

const customerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,
        validate: {
            validator: function (v) {
                return validator.matches(v, /^[a-zA-Z0-9_]+$/) && validator.isLength(v, { min: 3, max: 20 });
            },
            message: props => `${props.value} is not a valid username.`
        }
    },
    name: {
        type: String,
        required: [true, 'name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        validate: {
            validator: function (v) {
                return validator.isEmail(v);
            },
            message: function (props) {
                return `${props.value} is not a valid email address for ${props.path}`;
            }
        }
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },

    address: {
        type: String,
        required: [true, 'address is required']
    },
    phoneNumber: {
        type: String,
        required: [true, "phone no. is required"],
        unique: true,
        validate: {
            validator: function (v) {
                return validator.isMobilePhone(v, 'en-NG');
            },
            message: props => `${props.value} is not a valid phone number in Nigeria.`
        }
    },
}
);

customerSchema.pre('save', async function (next) {
    try {
        this.email = this.email.toLowerCase()
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {

        next(error)
    }
})

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
