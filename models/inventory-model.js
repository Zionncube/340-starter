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

/* ***************************
 *  Insert new classification
 *  returns the created row
 * ************************** */
async function insertClassification(classification_name) {
  try {
    const sql = `INSERT INTO public.classification (classification_name)
                 VALUES ($1)
                 RETURNING *`
    const result = await pool.query(sql, [classification_name])
    return result.rows[0]
  } catch (error) {
    console.error('insertClassification error', error)
    throw error
  }
}

async function getVehicleById(inv_id) {
  const sql = 'SELECT * FROM public.inventory WHERE inv_id = $1'
  return await pool.query(sql, [inv_id])
}

/* ***************************
 *  Insert new inventory item
 *  returns created row
 * ************************** */
async function insertInventory({
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id,
}) {
  try {
    const sql = `INSERT INTO public.inventory
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`
    const values = [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    ]
    const result = await pool.query(sql, values)
    return result.rows[0]
  } catch (error) {
    console.error('insertInventory error', error)
    throw error
  }
}


module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  insertClassification,   // ← add this line
  insertInventory         // (add this too if you use it elsewhere)
}

