// models/account.js
const pool = require('../database'); // your database connection


/* ****************************************
 *  Check if an email already exists
 * **************************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    return result.rowCount; // >0 means email exists
  } catch (error) {
    console.error("Error checking email:", error.message);
    throw new Error(error.message);
  }
}

/* ****************************************
 *  Register a new account
 * **************************************** */
async function registerAccount(account) {
  try {
    const { account_firstname, account_lastname, account_email, account_password } = account;

    const sql = `INSERT INTO account 
      (account_firstname, account_lastname, account_email, account_password)
      VALUES ($1, $2, $3, $4) RETURNING *`;

    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);

    return result.rows[0];
  } catch (error) {
    console.error("Error registering account:", error.message);
    throw new Error(error.message);
  }
}

/* ****************************************
 *  Get account by email (for login)
 * **************************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    return result.rows[0]; // undefined if not found
  } catch (error) {
    console.error("Error fetching account:", error.message);
    throw new Error(error.message);
  }
}

/* ****************************************
 *  Export functions
 * **************************************** */
module.exports = {
  checkExistingEmail,
  registerAccount,
  getAccountByEmail,
};
