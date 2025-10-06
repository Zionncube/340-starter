const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/accountModel")

const validate = {}

validate.registrationRules = () => [
  body("account_firstname").trim().escape().notEmpty().withMessage("Please provide a first name."),
  body("account_lastname").trim().escape().notEmpty().withMessage("Please provide a last name."),
  body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (emailExists) {
        throw new Error("Email exists. Please log in or use a different email.")
      }
    }),
  body("account_password")
    .trim()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password must be at least 12 characters and include uppercase, lowercase, number & symbol."),
  body("account_type")
    .isIn(['Client', 'Employee', 'Admin'])
    .withMessage("Please select a valid account type.")
]

validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_type } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/register", {
      title: "Register",
      nav,
      errors: errors.array(),
      message: null,
      account_firstname: account_firstname || '',
      account_lastname: account_lastname || '',
      account_email: account_email || '',
      account_type: account_type || 'Client'  // ADD THIS LINE
    })
  }
  next()
}
validate.loginRules = () => [
  body("account_email").trim().isEmail().normalizeEmail().withMessage("A valid email is required."),
  body("account_password").trim().notEmpty().withMessage("Password is required.")
]

validate.checkLoginData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email: req.body.account_email,
    })
  }
  next()
}

validate.updateAccountRules = () => [
  body("account_firstname").trim().notEmpty().withMessage("First name required."),
  body("account_lastname").trim().notEmpty().withMessage("Last name required."),
  body("account_email").trim().isEmail().withMessage("Valid email required."),
]

validate.checkUpdateData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      message: null,
      account_firstname: req.body.account_firstname || '',
      account_lastname: req.body.account_lastname || '',
      account_email: req.body.account_email || '',
      account_id: req.body.account_id || ''
    })
  }
  next()
}

validate.checkUpdatePassword = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      message: null,
      account_firstname: req.body.account_firstname || '',
      account_lastname: req.body.account_lastname || '',
      account_email: req.body.account_email || '',
      account_id: req.body.account_id || ''
    })
  }
  next()
}

validate.updatePasswordRules = () => [
  body("account_password")
    .trim()
    .isLength({ min: 12 })
    .withMessage("Password must be at least 12 characters.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain a number.")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain a special character."),
]


module.exports = validate