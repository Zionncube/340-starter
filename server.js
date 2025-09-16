const express = require('express');
const path = require('path');
const baseController = require("./controllers/baseController");

const app = express();
const PORT = process.env.PORT || 5500;
// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.get("/", baseController.buildHome);

// Start server - IMPORTANT: Listen on 0.0.0.0 for Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ App listening on port ${PORT}`);
});