const utilities = require("../utilities")
const accountModel = require("../models/accountModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    message: req.flash("notice")
  })
}

async function buildRegister(req, res) {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    message: null,
    account_firstname: '',
    account_lastname: '',
    account_email: '',
    account_type: 'Client'  // ADD THIS LINE
  })
}

async function buildLogin(req, res) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

async function registerUser(req, res) {
  const { account_firstname, account_lastname, account_email, account_password, account_type } = req.body
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    return res.status(500).render("account/register", {
      title: "Registration",
      nav: await utilities.getNav(),
      errors: null,
    })
  }
  const exists = await accountModel.checkExistingEmail(account_email)
  if (exists) {
    req.flash("notice", "Email already exists.")
    return res.redirect("/account/register")
  }
  const newAccount = await accountModel.registerAccount({
    account_firstname,
    account_lastname,
    account_email,
    account_password: hashedPassword,
    account_type // <-- pass to model
  })
  req.flash("notice", "Registration successful. Please log in.")
  res.redirect("/account/login")
}

async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    req.flash("notice", "Access Forbidden")
    return res.status(403).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }
}

async function buildUpdateView(req, res) {
  const account_id = req.params.account_id
  const nav = await utilities.getNav()
  try {
    const account = await accountModel.getAccountById(account_id)
    if (!account) {
      req.flash("notice", "Account not found.")
      return res.redirect("/account/")
    }
    res.render("account/update", {
      title: "Update Account",
      nav,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email,
      account_id: account.account_id,
      errors: null,
      message: req.flash("notice")
    })
  } catch (error) {
    req.flash("notice", "Error loading account information.")
    res.redirect("/account/")
  }
}

async function updateAccount(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)
  if (updateResult) {
    req.flash("notice", "Account updated successfully.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Update failed.")
    res.redirect(`/account/update/${account_id}`)
  }
}

async function updatePassword(req, res) {
  const { account_id, account_password } = req.body
  const hashedPassword = await bcrypt.hash(account_password, 10)
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword)
  if (updateResult) {
    req.flash("notice", "Password updated successfully.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Password update failed.")
    res.redirect(`/account/update/${account_id}`)
  }
}

function logout(req, res) {
  res.clearCookie("jwt")
  res.redirect("/")
}

module.exports = {
  buildRegister,
  buildLogin,
  registerUser,
  accountLogin,
  buildAccountManagement,
  buildUpdateView,
  updateAccount,
  updatePassword,
  logout
}