// utilities/index.js
const invModel = require("../models/inventory-model")
const Util = {}

/* ---------- Build the site-wide navigation menu ---------- */
Util.getNav = async function () {
  try {
    const data = await invModel.getClassifications() // data is an array of rows
    let list = '<ul>'
    list += '<li><a href="/" title="Home page">Home</a></li>'

    data.forEach(row => {
      list += `
        <li>
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
    // Return a minimal nav so the page still renders
    return '<ul><li><a href="/" title="Home page">Home</a></li></ul>'
  }
}

/* ---------- Build the grid of vehicles by classification ---------- */
Util.buildClassificationGrid = function (data) {
  if (!Array.isArray(data) || data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  let grid = '<ul id="inv-display">'
  data.forEach(vehicle => {
    grid += `
      <li>
        <a href="../../inv/detail/${vehicle.inv_id}"
           title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
           <img src="${vehicle.inv_thumbnail}"
                alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="../../inv/detail/${vehicle.inv_id}"
               title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
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

/* ---------- Build the single vehicle detail view ---------- */
Util.buildVehicleDetail = function (vehicle) {
  if (!vehicle) return '<p class="notice">Vehicle not found.</p>'

  const price = new Intl.NumberFormat('en-US',
    { style: 'currency', currency: 'USD' }).format(vehicle.inv_price)
  const miles = new Intl.NumberFormat('en-US').format(vehicle.inv_miles)

  return `
    <div class="vehicle-detail">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}"
             alt="${vehicle.inv_make} ${vehicle.inv_model}">
      </div>
      <div class="vehicle-info">
        <h1>${vehicle.inv_make} ${vehicle.inv_model}
          <span class="year">(${vehicle.inv_year})</span></h1>
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

module.exports = Util
