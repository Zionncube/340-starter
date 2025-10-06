const pool = require("../database/")

async function checkExistingEmail(account_email) {
  const sql = "SELECT * FROM account WHERE account_email = $1"
  const data = await pool.query(sql, [account_email])
  return data.rowCount
}

async function registerAccount(account) {
  const sql = `
    INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `
  const data = await pool.query(sql, [
    account.account_firstname,
    account.account_lastname,
    account.account_email,
    account.account_password,
    account.account_type // <-- new field
  ])
  return data.rows[0]
}

async function getAccountByEmail(account_email) {
  const sql = "SELECT * FROM account WHERE account_email = $1"
  const data = await pool.query(sql, [account_email])
  return data.rows[0]
}

async function getAccountById(account_id) {
  const sql = "SELECT * FROM account WHERE account_id = $1"
  const data = await pool.query(sql, [account_id])
  return data.rows[0]
}

async function updateAccount(account_id, firstname, lastname, email) {
  const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
  const data = await pool.query(sql, [firstname, lastname, email, account_id])
  return data.rows[0]
}

async function updatePassword(account_id, hashedPassword) {
  const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
  const data = await pool.query(sql, [hashedPassword, account_id])
  return data.rows[0]
}

module.exports = {
  checkExistingEmail,
  registerAccount,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword
}
