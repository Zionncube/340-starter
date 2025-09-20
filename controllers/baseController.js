// controllers/baseController.js
const utilities = require("../utilities/")
// Controller for handling the home page request
const baseController = {}

// Function to build and render the home page
baseController.buildHome = async function(req, res){
  // Get navigation data using a utility function
  const nav = await utilities.getNav()
  // Render the 'index' view with the title and navigation data
  res.render("index", { title: "Home", nav })
}

// Export the baseController object to be used in other files
module.exports = baseController

