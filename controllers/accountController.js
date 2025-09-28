const utilities = require("../utilities")
const accountModel = require('../models/accountModel');

/* ****************************************
*  Deliver registration view
* **************************************** */
async function buildRegister(req, res) {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null // very important – prevents EJS error
  })
}

/* ****************************************
*  Deliver login view
* **************************************** */
async function buildLogin(req, res) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process registration (after validation)
* **************************************** */
// Example: registration
async function registerUser(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password before storing
let hashedPassword
try {
  hashedPassword = await bcrypt.hashSync(account_password, 10)
} catch (error) {
  req.flash("notice", "Sorry, there was an error processing the registration.")
  return res.status(500).render("account/register", {
    title: "Registration",
    nav,
    errors: null,
  })
}

  // check if email exists
  const exists = await accountModel.checkExistingEmail(account_email);
  if (exists > 0) {
    return res.send("Email already exists");
  }

  // register new account
  const newAccount = await accountModel.registerAccount({
    account_firstname,
    account_lastname,
    account_email,
    account_password: hashedPassword,
  });


  res.send(`Welcome, ${newAccount.account_firstname}`);
}

// Example: login
async function loginUser(req, res) {
  const { account_email, account_password } = req.body;

  const account = await accountModel.getAccountByEmail(account_email);
  if (!account || account.account_password !== account_password) {
    return res.send("Invalid login credentials");
  }

  res.send(`Hello, ${account.account_firstname}`);
}

async function registerAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // server-side validation here
  if (!account_email || !account_password) {
    return res.render('account/register', {
      title: 'Register',
      errors: ['Email and password are required.'],
    });
  }

  // call model to insert account
  const newAccount = await accountModel.registerAccount({
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  });

  res.redirect('/account/login');
}


module.exports = { buildRegister, buildLogin, registerAccount }
