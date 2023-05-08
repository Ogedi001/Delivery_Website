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
        required: [true, 'password is required'],
        validate: {
            validator: function (password) {
                // add your validation logic here
                return validator.isStrongPassword(password);
            },
            message: 'Weak password, should be at least 8 characters long and contains   atleast 1 uppercase,lowercase,number and a symbol'
        }
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
    profile_pic: {
        data: Buffer,
        contentType: String
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

customerSchema.statics.findUserByEmailOrUsername = function (usernameOrEmail, password) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!usernameOrEmail) {
                reject('Please insert a valid email or username')
                return
            }
            if (!password) {
                reject("Please insert passsword")
                return
            }

            const user = await this.findOne({ $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }] })

            console.log(user)

            if (!user) {
                reject('User does not exist!')
                return
            }
            const validUser = bcrypt.compareSync(password, user.password)

            if (!validUser) {
                reject('Invalid credentials')
                return
            }
            resolve(user)

        } catch (error) {
            reject(error)
        }
    })
}

// Add a method to update customer age
customerSchema.methods.updateAge = async function (age) {
    console.log('Before update:', this.age); // Check the initial value of age field
    this.age = age;
    await this.save();
    console.log('After update:', this.age); // Check the updated value of age field
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
