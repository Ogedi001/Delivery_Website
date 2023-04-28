require('dotenv').config()
const express = require('express'),
  bcrypt = require('bcrypt'),
  _ = require('lodash'),
  appRouter = require('./Router/router.del'),
  mongoose = require('mongoose'),
  customer = require('./models/cus.reg.model')

const cookieParser = require('cookie-parser');




const app = express()

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
const DB_URL = process.env.DB_URL,
  PORT = process.env.PORT || 3000

const main = async () => {

  try {

    console.log("connecting to Database.....");
    await mongoose.connect(DB_URL)
    console.log('Database connected successfully');

    app.use("/", appRouter)



  } catch (error) {

    console.log(error)
  }

  app.listen(PORT, () => {
    console.log(`App is live at https://localhost:${PORT}`)
  })
}


main()

