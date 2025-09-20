/// models/inventory-model.js
const pool = require("../database/")

/* ***************************
 *  Get all classifications
 * ************************** */
async function getClassifications() {
  try {
    const data = await pool.query(
      `SELECT * FROM public.classification
       ORDER BY classification_name`
    )
    return data.rows
  } catch (error) {
    console.error("getClassifications error " + error)
    throw error        // re-throw so the route can send a 500
  }
}

/* ***************************
 *  Get all inventory items by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
       JOIN public.classification AS c
       ON i.classification_id = c.classification_id
       WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
    throw error
  }
}

async function getVehicleById(inv_id) {
  const sql = 'SELECT * FROM public.inventory WHERE inv_id = $1'
  return await pool.query(sql, [inv_id])
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById
}

