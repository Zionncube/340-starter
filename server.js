// server.js
// Main entry point for the application

// Import utilities
const Util = require("./utilities")  // at top of server.js

// Load environment variables from .env file
require('dotenv').config();
// Import necessary modules
const express = require('express');
// Path module to handle file paths

const path = require('path');
// Import base controller
const baseController = require("./controllers/baseController");

// Import inventory routes
const inventoryRoute = require("./routes/inventoryRoute");

// Create an Express application
const app = express();
// Define the port to run the server on
const PORT = process.env.PORT || 5500;

// EJS setup.
// Set the view engine to EJS for rendering HTML templates
app.set('view engine', 'ejs');
// Set the directory for views
app.set('views', path.join(__dirname, 'views'));

// Static files
// Serve static files from the 'public' directory
app.use('/css', express.static(path.join(__dirname, 'public/css')));
// Serve images from the 'public/images' directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
// Home route
app.get("/", baseController.buildHome);

// Inventory routes
// Use the inventory routes for any requests to /inv
app.use("/inv", inventoryRoute);

const miscRoutes = require('./routes/misc')
app.use('/', miscRoutes)


// 404 handler
app.use((req, res, next) => {
  res.status(404)
  res.render('error', { title: '404 - Not found', message: 'Sorry, the page was not found.' })
})

// error handler (500 and others)
app.use(async (err, req, res, next) => {
  console.error('Global error handler:', err)

  const status = err.status || 500
  const message =
    status === 500
      ? 'Sorry, something went wrong on our side.'
      : err.message

  try {
    // ✅ build the navigation HTML
    const nav = await Util.getNav()

    // ✅ include nav when rendering the error view
    res.status(status).render('error', {
      title: `${status} Error`,
      message,
      nav
    })
  } catch (navErr) {
    // Fallback in case nav itself fails
    console.error('Nav build failed:', navErr)
    res
      .status(status)
      .send(`<h1>${status} Error</h1><p>${message}</p>`)
  }
})

// Start server - IMPORTANT: Listen on 0.0.0.0 for Render
// Start the server and listen on the specified port and all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  // Log a message to the console when the server is running
  console.log(`✅ App listening on port ${PORT}`);
});
