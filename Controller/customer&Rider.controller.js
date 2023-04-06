const getHome = (req, res) => {

    res.render('homepage');
}

const getSignUP = (req, res) => {
    const signUpType = req.params.signUpType;

    if (signUpType === 'rider') {
        res.render('signup_rider');
    } else if (signUpType === 'customer') {

        res.render('signup_customer', { passwordMSG: null, errors: null, value: null, message: null })
    } else {
        res.send('Invalid user type');
    }
}

module.exports = { getHome, getSignUP }