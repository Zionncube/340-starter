/************************************************************
 * server.js – Main entry point
 ************************************************************/

// Load environment variables first
require('dotenv').config()

const express = require('express')
const path = require('path')

const Util = require('./utilities')
const baseController = require('./controllers/baseController')
const inventoryRoute = require('./routes/inventoryRoute')
const miscRoutes = require('./routes/misc')
const accountRoute = require("./routes/accountRoute")


// If you need flash/session later, just uncomment:
 const session = require('express-session')
 const flash = require('connect-flash')

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

// Body parser (needed for forms)
app.use(express.urlencoded({ extended: true }))

// Session + flash (only if/when you need it)
app.use(
   session({
    secret: process.env.SESSION_SECRET || 'devsecret',
     resave: false,
     saveUninitialized: false,
     cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
   })
 )
 app.use(flash())
 app.use((req, res, next) => {
  res.locals.message = req.flash()
  next()
 })

/***********************
 * Routes
 ***********************/
app.get('/', baseController.buildHome)
app.use('/inv', inventoryRoute)
app.use('/', miscRoutes)
app.use('/account', accountRoute)

/***********************
 * 404 handler
 ***********************/
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 - Not found',
    message: 'Sorry, the page was not found.',
    nav: '' // we can optionally build nav here too
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
    // Build navigation HTML for the error page
    const nav = await Util.getNav()
    res.status(status).render('error', {
      title: `${status} Error`,
      message,
      nav
    })
  } catch (navErr) {
    console.error('Nav build failed:', navErr)
    // Fallback if nav itself fails
    res.status(status).send(`<h1>${status} Error</h1><p>${message}</p>`)
  }
})

/***********************
 * Start server
 ***********************/
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ App listening on port ${PORT}`)
})
