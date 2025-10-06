const express = require("express")
const router = express.Router()

const accountController = require("../controllers/accountController")
const accountValidate = require("../utilities/account-validation")
const utilities = require("../utilities")
const { checkJWT } = require("../utilities/account-middleware")

// Registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post(
  "/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerUser)
)

// Login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Account management view (protected)
router.get("/", checkJWT, utilities.handleErrors(accountController.buildAccountManagement))

// Update account info view (protected)
router.get("/update/:account_id", checkJWT, utilities.handleErrors(accountController.buildUpdateView))
router.post(
  "/update",
  checkJWT,
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)
router.post(
  "/update-password",
  checkJWT,
  accountValidate.updatePasswordRules(),
  accountValidate.checkUpdatePassword,
  utilities.handleErrors(accountController.updatePassword)
)

// Logout
router.get("/logout", accountController.logout)

module.exports = router