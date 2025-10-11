const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

validate.reviewRules = () => [
  body("review_rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5 stars."),
  body("review_title")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Review title must be between 5 and 100 characters."),
  body("review_text")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Review text must be between 10 and 1000 characters.")
]

validate.checkReviewData = async (req, res, next) => {
  const { inv_id, review_rating, review_title, review_text } = req.body
  let errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const invModel = require("../models/inventory-model")
    const vehicle = await invModel.getVehicleById(inv_id)
    
    return res.render("reviews/add-review", {
      title: `Review ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      errors: errors.array(),
      review_rating,
      review_title,
      review_text
    })
  }
  next()
}

module.exports = validate