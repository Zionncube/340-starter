const pool = require("../database/")

async function addReview(reviewData) {
  const sql = `INSERT INTO reviews (account_id, inv_id, review_rating, review_title, review_text) 
               VALUES ($1, $2, $3, $4, $5) RETURNING *`
  const data = await pool.query(sql, [
    reviewData.account_id,
    reviewData.inv_id, 
    reviewData.review_rating,
    reviewData.review_title,
    reviewData.review_text
  ])
  return data.rows[0]
}

async function getReviewsByVehicle(inv_id) {
  const sql = `SELECT r.*, a.account_firstname, a.account_lastname 
               FROM reviews r 
               JOIN account a ON r.account_id = a.account_id 
               WHERE r.inv_id = $1 
               ORDER BY r.review_date DESC`
  const data = await pool.query(sql, [inv_id])
  return data.rows
}

async function getVehicleRatingStats(inv_id) {
  const sql = `SELECT 
               COUNT(*) as review_count,
               AVG(review_rating) as avg_rating
               FROM reviews 
               WHERE inv_id = $1`
  const data = await pool.query(sql, [inv_id])
  return data.rows[0]
}

async function checkUserReview(account_id, inv_id) {
  const sql = `SELECT * FROM reviews WHERE account_id = $1 AND inv_id = $2`
  const data = await pool.query(sql, [account_id, inv_id])
  return data.rowCount > 0
}

async function deleteReview(review_id) {
  const sql = `DELETE FROM reviews WHERE review_id = $1`
  const data = await pool.query(sql, [review_id])
  return data.rowCount > 0
}

async function getAllReviews() {
  const sql = `SELECT r.*, a.account_firstname, a.account_lastname, i.inv_make, i.inv_model
               FROM reviews r 
               JOIN account a ON r.account_id = a.account_id 
               JOIN inventory i ON r.inv_id = i.inv_id
               ORDER BY r.review_date DESC`
  const data = await pool.query(sql)
  return data.rows
}

module.exports = {
  addReview,
  getReviewsByVehicle,
  getVehicleRatingStats,
  checkUserReview,
  deleteReview,
  getAllReviews
}