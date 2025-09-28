const express = require("express")
const router = express.Router()

const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")
const utilities = require("../utilities")

// Registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// Login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// Process registration form
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt {FOR TESTING ONLY - CHANGE LATER}
router.post("/login", (req, res) => {
  res.status(200).send("login process")
})


module.exports = router
