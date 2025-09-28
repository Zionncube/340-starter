// controllers/inventory.js
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* *******************************
 * Inventory Management View
 * GET /inv/
 * *******************************/
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render('inventory/management', {
      title: 'Inventory Management',
      nav,
      message: res.locals.message,
    });
  } catch (error) {
    next(error);
  }
};

/* *******************************
 * Add Classification Views
 * GET /inv/add-classification
 * *******************************/
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render('inventory/add-classification', {
      title: 'Add Classification',
      nav,
      message: res.locals.message,
      classification_name: '',
    });
  } catch (error) {
    next(error);
  }
};

/* POST Add Classification */
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    const cleaned = classification_name ? classification_name.trim() : '';

    if (!cleaned || cleaned.length < 2) {
      return res.render('inventory/add-classification', {
        title: 'Add Classification',
        nav: await utilities.getNav(),
        message: 'Classification name must be at least 2 characters.',
        classification_name: cleaned,
      });
    }

    const created = await invModel.insertClassification(cleaned);
    if (created) {
      req.flash('success', 'Classification added successfully.');
      return res.redirect('/inv/');
    } else {
      req.flash('error', 'Failed to add classification.');
      return res.redirect('/inv/add-classification');
    }
  } catch (error) {
    next(error);
  }
};

/* *******************************
 * Add Inventory Views
 * GET /inv/add-inventory
 * *******************************/
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render('inventory/add-inventory', {
      title: 'Add Vehicle',
      nav,
      message: res.locals.message,
      classificationList,
      inv_make: '',
      inv_model: '',
      inv_year: '',
      inv_description: '',
      inv_image: '/images/no-image-available.png',
      inv_thumbnail: '/images/no-image-available-tn.png',
      inv_price: '',
      inv_miles: '',
      inv_color: '',
      classification_id: '',
    });
  } catch (error) {
    next(error);
  }
};

/* POST Add Inventory */
invCont.addInventory = async function (req, res, next) {
  try {
    const {
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
    } = req.body;

    // Basic server-side validation
    const errors = [];
    if (!classification_id) errors.push("Select a classification.");
    if (!inv_make || inv_make.length < 2) errors.push("Make must be at least 2 characters.");
    if (!inv_model || inv_model.length < 2) errors.push("Model must be at least 2 characters.");
    if (!inv_year || inv_year < 1900 || inv_year > 2099) errors.push("Year must be valid.");
    if (!inv_price || inv_price < 0) errors.push("Price must be a positive number.");
    if (!inv_miles || !/^\d+$/.test(inv_miles)) errors.push("Miles must be digits only.");
    if (!inv_color) errors.push("Color is required.");

    if (errors.length > 0) {
      const classificationList = await utilities.buildClassificationList();
      return res.render('inventory/add-inventory', {
        title: 'Add Vehicle',
        nav: await utilities.getNav(),
        message: errors.join(' '),
        classificationList,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image: inv_image || '/images/no-image-available.png',
        inv_thumbnail: inv_thumbnail || '/images/no-image-available-tn.png',
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      });
    }

    // Prepare vehicle data
    const newVehicle = {
      inv_make: inv_make.trim(),
      inv_model: inv_model.trim(),
      inv_year: inv_year.trim(),
      inv_description: inv_description.trim(),
      inv_image: inv_image || '/images/no-image-available.png',
      inv_thumbnail: inv_thumbnail || '/images/no-image-available-tn.png',
      inv_price: Number(inv_price),
      inv_miles: Number(inv_miles),
      inv_color: inv_color.trim(),
      classification_id: Number(classification_id),
    };

    const created = await invModel.insertInventory(newVehicle);
    if (created) {
      req.flash('success', 'New vehicle added successfully.');
      return res.redirect('/inv/');
    } else {
      req.flash('error', 'Failed to add vehicle.');
      return res.redirect('/inv/add-inventory');
    }
  } catch (error) {
    next(error);
  }
};

/* *******************************
 * Inventory by Classification
 * GET /inv/classification/:classificationId
 * *******************************/
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);

    if (!data || data.length === 0) {
      return res.render('inventory/classification', {
        title: 'No vehicles found',
        nav: await utilities.getNav(),
        grid: '<p>No vehicles found for this classification.</p>',
      });
    }

    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data[0].classification_name;

    res.render('inventory/classification', {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* *******************************
 * Vehicle Detail View
 * GET /inv/detail/:inv_id
 * *******************************/
invCont.buildById = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    if (!inv_id) return res.status(400).render('error', { title: 'Error', message: 'No vehicle id provided' });

    const data = await invModel.getVehicleById(inv_id);

    if (!data || !data.rows || data.rows.length === 0) {
      const notFound = new Error('Vehicle not found');
      notFound.status = 404;
      throw notFound;
    }

    const vehicle = data.rows[0];
    const vehicleDetail = await utilities.buildVehicleDetail(vehicle);

    res.render('inventory/detail', {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicleDetail,
      nav: await utilities.getNav(),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = invCont;
// utilities/account-validation.js