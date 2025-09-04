/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const app = express();
const static = require("./routes/static");

/* ***********************
 * View engine and templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost"; // optional, for local testing

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(PORT, () => {
  console.log(`App listening on ${HOST}:${PORT}`);
});

/* ***********************
 * Home Route
 *************************/
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

