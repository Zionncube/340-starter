// utilities/index.js
// Utility functions for navigation and building dynamic HTML

const invModel = require("../models/inventory-model")
const Util = {}

/* ------------------------------------------------------------------
   getNav – Build the site-wide navigation menu (<ul>).
   Returns an HTML string of <li> links for Home + all classifications.
   Includes try/catch so the page still renders if the DB call fails.
-------------------------------------------------------------------*/
Util.getNav = async function () {
  try {
    const rows = await invModel.getClassifications() // array of {classification_id, classification_name}
    let list = '<ul>'
    list += '<li><a href="/" title="Home page">Home</a></li>'
    rows.forEach((row) => {
      list += `<li>
        <a href="/inv/type/${row.classification_id}"
           title="See our inventory of ${row.classification_name} vehicles">
           ${row.classification_name}
        </a>
      </li>`
    })
    list += '</ul>'
    return list
  } catch (err) {
    console.error('getNav error:', err)
    // Fallback nav so the page still renders
    return '<ul><li><a href="/" title="Home page">Home</a></li></ul>'
  }
}

/* ------------------------------------------------------------------
   buildClassificationList – Build a <select> element with all
   classifications. Pass a classification_id to keep it selected.
-------------------------------------------------------------------*/
Util.buildClassificationList = async function (classification_id = null) {
  const rows = await invModel.getClassifications()
  let classificationList = '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"
      ${classification_id != null && row.classification_id == classification_id ? 'selected' : ''}>
      ${row.classification_name}
    </option>`
  })
  classificationList += '</select>'
  return classificationList
}

/* ------------------------------------------------------------------
   buildClassificationGrid – Build a grid of vehicle cards
   for a given classification.
-------------------------------------------------------------------*/
Util.buildClassificationGrid = function (data) {
  if (!Array.isArray(data) || data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  let grid = '<ul id="inv-display">'
  data.forEach(vehicle => {
    grid += `<li>
      <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
        <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </a>
      <div class="namePrice">
        <hr />
        <h2>
          <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            ${vehicle.inv_make} ${vehicle.inv_model}
          </a>
        </h2>
        <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
      </div>
    </li>`
  })
  grid += '</ul>'
  return grid
}

/* ------------------------------------------------------------------
   buildVehicleDetail – Build the full detail view for a single vehicle.
-------------------------------------------------------------------*/
Util.buildVehicleDetail = function (vehicle) {
  if (!vehicle) return '<p class="notice">Vehicle not found.</p>'

  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.inv_price)
  const miles = new Intl.NumberFormat('en-US').format(vehicle.inv_miles)

  return `
    <div class="vehicle-detail">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
      </div>
      <div class="vehicle-info">
        <h1>${vehicle.inv_make} ${vehicle.inv_model} <span class="year">(${vehicle.inv_year})</span></h1>
        <div class="price">${price}</div>
        <ul class="specs">
          <li><strong>Mileage:</strong> ${miles} miles</li>
          <li><strong>Color:</strong> ${vehicle.inv_color}</li>
          <li><strong>Transmission:</strong> ${vehicle.inv_transmission || 'N/A'}</li>
          <li><strong>Drive:</strong> ${vehicle.inv_drivetrain || 'N/A'}</li>
        </ul>
        <div class="description">
          <h2>Description</h2>
          <p>${vehicle.inv_description}</p>
        </div>
      </div>
    </div>`
}

/**
 * Wraps async route handlers so thrown errors go to Express's error handler.
 */
Util.handleErrors = function (fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}


module.exports = Util
