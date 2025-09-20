// Needed Resources 
// routes/inventoryRoute.js
// Inventory routes
// Import necessary modules
const express = require("express")
// Create a new router instance
const router = new express.Router()
// Import the inventory controller to handle requests 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// existing routes...
// route for a single vehicle detail
router.get('/detail/:inv_id', invController.buildById)


// Export the router to be used in other files
module.exports = router;