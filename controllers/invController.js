const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
// invController.js
// Controller to handle requests for inventory by classification ID
invCont.buildByClassificationId = async function (req, res, next) {
  // Extract classificationId from request parameters
  const classification_id = req.params.classificationId
  // Fetch inventory data for the given classification ID
  const data = await invModel.getInventoryByClassificationId(classification_id)
  // If no data is found, render the error view with a message
  const grid = await utilities.buildClassificationGrid(data)
  // If no grid is returned, render the error view
  let nav = await utilities.getNav()
  // If no navigation data is found, set nav to an empty string
  const className = data[0].classification_name
  // Render the classification view with the retrieved data
  res.render("./inventory/classification", {
    // Pass the classification name, navigation, and grid data to the view
    title: className + " vehicles",
    nav,
    grid,
  })
}


invCont.buildById = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    if (!inv_id) return res.status(400).render('error', { title: 'Error', message: 'No vehicle id provided' })

    const data = await invModel.getVehicleById(inv_id)

    if (!data || !data.rows || data.rows.length === 0) {
      // 404 not found -> forward to 404 handler by creating error
      const notFound = new Error('Vehicle not found')
      notFound.status = 404
      throw notFound
    }

    const vehicle = data.rows[0]
    const vehicleDetail = await utilities.buildVehicleDetail(vehicle)

    res.render('inventory/detail', {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicleDetail,
      nav: await utilities.getNav()
    })
  } catch (err) {
    next(err) // pass to error handling middleware
  }
}


module.exports = invCont