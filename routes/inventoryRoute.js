// routes/inventoryRoute.js
// -------------------------------------------------------------
// Inventory routes for the application
// Handles management views, adding classifications/vehicles,
// and displaying inventory by classification or individual detail.
// -------------------------------------------------------------

const express = require('express')
const { body, validationResult } = require('express-validator')
const invController = require('../controllers/invController')

const router = new express.Router()

/* -----------------------------------------------------------
   Management Dashboard
   Shows the main inventory management page
-----------------------------------------------------------*/
router.get('/', invController.buildManagement)

/* -----------------------------------------------------------
   ADD CLASSIFICATION
   GET: Show the add-classification form
   POST: Validate and add a new classification
-----------------------------------------------------------*/
router.get('/add-classification', invController.buildAddClassification)

router.post(
  '/add-classification',
  // Validation: required, only letters, numbers, hyphen or underscore
  body('classification_name')
    .trim()
    .notEmpty().withMessage('Classification name is required')
    .matches(/^[A-Za-z0-9_-]+$/).withMessage('No spaces or special characters allowed'),
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // Flash all validation errors in one message
      req.flash('error', errors.array().map(e => e.msg).join(' - '))
      return res.redirect('/inv/add-classification')
    }
    return invController.addClassification(req, res, next)
  }
)

/* -----------------------------------------------------------
   ADD INVENTORY
   GET: Show the add-inventory form
   POST: Validate, show sticky form on errors, or add vehicle
-----------------------------------------------------------*/
router.get('/add-inventory', invController.buildAddInventory)

router.post(
  '/add-inventory',
  [
    body('inv_make').trim().notEmpty().withMessage('Make is required'),
    body('inv_model').trim().notEmpty().withMessage('Model is required'),
    body('inv_year').trim().isLength({ min: 4, max: 4 }).withMessage('Year must be 4 digits'),
    body('inv_price').notEmpty().withMessage('Price required').isFloat({ min: 0 }).withMessage('Price must be a number'),
    body('inv_miles').notEmpty().withMessage('Mileage required').isInt({ min: 0 }).withMessage('Miles must be an integer'),
    body('inv_color').trim().notEmpty().withMessage('Color required'),
    body('classification_id').notEmpty().withMessage('Classification must be chosen').isInt().withMessage('Invalid classification'),
    body('inv_description').trim(),        // optional
    body('inv_image').trim().optional(),
    body('inv_thumbnail').trim().optional(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // Flash all validation errors
      req.flash('error', errors.array().map(e => e.msg).join(' - '))

      // Build nav & classification list for sticky form re-render
      const utilities = require('../utilities/')
      const nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList(req.body.classification_id || null)

      return res.render('inventory/add-inventory', {
        title: 'Add Vehicle',
        nav,
        message: res.locals.message,
        classificationList,
        // Sticky values: repopulate form fields with submitted data
        inv_make: req.body.inv_make || '',
        inv_model: req.body.inv_model || '',
        inv_year: req.body.inv_year || '',
        inv_description: req.body.inv_description || '',
        inv_image: req.body.inv_image || '/images/no-image-available.png',
        inv_thumbnail: req.body.inv_thumbnail || '/images/no-image-available-tn.png',
        inv_price: req.body.inv_price || '',
        inv_miles: req.body.inv_miles || '',
        inv_color: req.body.inv_color || '',
        classification_id: req.body.classification_id || '',
      })
    }
    // No validation errors -> add vehicle to inventory
    return invController.addInventory(req, res, next)
  }
)

/* -----------------------------------------------------------
   VIEW INVENTORY
   - By classification: /inv/type/:classificationId
   - Single vehicle detail: /inv/detail/:inv_id
-----------------------------------------------------------*/
router.get('/type/:classificationId', invController.buildByClassificationId)
router.get('/detail/:inv_id', invController.buildById)

module.exports = router
