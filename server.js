const express = require('express');
const path = require('path');
const baseController = require("./controllers/baseController")

const app = express();
const PORT = process.env.PORT || 3000;

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));


// Routes
app.get("/", baseController.buildHome)


app.listen(PORT, () => {
  console.log(`✅ App listening on http://localhost:${PORT}`);
});
