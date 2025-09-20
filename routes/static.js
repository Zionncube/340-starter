// routes/static.js
// Static Routes
// Import necessary modules
const express = require('express');
// Create a new router instance
const router = express.Router();

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public"));
// Serve static files from specific subdirectories
router.use("/css", express.static(__dirname + "public/css"));
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));

// Export the router to be used in other files
module.exports = router;



