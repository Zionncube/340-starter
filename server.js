/************************************************************
 * server.js – Main entry point
 ************************************************************/

// Load environment variables
require('dotenv').config()

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')
const { checkJWT } = require("./utilities/account-middleware");


// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5500

/***********************
 * View engine & static
 ***********************/
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Serve static assets
app.use('/css', express.static(path.join(__dirname, 'public/css')))
app.use('/images', express.static(path.join(__dirname, 'public/images')))

// Body parser for forms
app.use(express.urlencoded({ extended: true }))

// Cookie parser
app.use(cookieParser())

/***********************
 * Session + flash
 ***********************/
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'devsecret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
  })
)
app.use(flash())
//app.use(checkJWT); // makes account info available in all views


// Make flash messages available in views
app.use((req, res, next) => {
  res.locals.message = req.flash()
  next()
})

/***********************
 * Routes
 ***********************/
const accountRoute = require('./routes/accountRoute')
const inventoryRoute = require('./routes/inventoryRoute')
const miscRoutes = require('./routes/misc')
const baseController = require('./controllers/baseController')
const Util = require('./utilities')



// Public & base routes
app.get('/', baseController.buildHome)
app.use('/inv', inventoryRoute)
app.use('/', miscRoutes)
app.use('/account', accountRoute)


// Make account data available in all views (optional)
// app.use(Util.checkJWT)

/***********************
 * 404 handler
 ***********************/
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 - Not found',
    message: 'Sorry, the page was not found.',
    nav: '',
  })
})

/***********************
 * Global error handler
 ***********************/
app.use(async (err, req, res, next) => {
  console.error('Global error handler:', err)

  const status = err.status || 500
  const message =
    status === 500
      ? 'Sorry, something went wrong on our side.'
      : err.message

  try {
    const nav = await Util.getNav()
    res.status(status).render('error', {
      title: `${status} Error`,
      message,
      nav,
    })
  } catch (navErr) {
    console.error('Nav build failed:', navErr)
    res.status(status).send(`<h1>${status} Error</h1><p>${message}</p>`)
  }
})

/***********************
 * Start server
 ***********************/
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ App listening on port ${PORT}`)
})
