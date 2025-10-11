const reviewModel = require("../models/reviewModel")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

async function buildReviewForm(req, res) {
  const inv_id = req.params.inv_id
  const nav = await utilities.getNav()
  const vehicle = await invModel.getVehicleById(inv_id)
  
  // Check if user already reviewed this vehicle
  const hasReviewed = await reviewModel.checkUserReview(res.locals.accountData.account_id, inv_id)
  
  if (hasReviewed) {
    req.flash("notice", "You have already reviewed this vehicle.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }

  res.render("reviews/add-review", {
    title: `Review ${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    vehicle,
    errors: null,
    review_rating: 5,
    review_title: '',
    review_text: ''
  })
}

async function addReview(req, res) {
  const { inv_id, review_rating, review_title, review_text } = req.body
  const account_id = res.locals.accountData.account_id
  
  try {
    const reviewData = {
      account_id,
      inv_id,
      review_rating: parseInt(review_rating),
      review_title,
      review_text
    }
    
    const result = await reviewModel.addReview(reviewData)
    
    if (result) {
      req.flash("notice", "Review added successfully!")
      res.redirect(`/inv/detail/${inv_id}`)
    } else {
      req.flash("notice", "Sorry, adding review failed.")
      res.redirect(`/reviews/add/${inv_id}`)
    }
  } catch (error) {
    req.flash("notice", "Sorry, there was an error adding your review.")
    res.redirect(`/reviews/add/${inv_id}`)
  }
}

async function buildManageReviews(req, res) {
  const nav = await utilities.getNav()
  const reviews = await reviewModel.getAllReviews()
  
  res.render("reviews/manage", {
    title: "Manage Reviews",
    nav,
    reviews,
    errors: null
  })
}

async function deleteReview(req, res) {
  const review_id = req.params.review_id
  const result = await reviewModel.deleteReview(review_id)
  
  if (result) {
    req.flash("notice", "Review deleted successfully.")
  } else {
    req.flash("notice", "Review deletion failed.")
  }
  
  res.redirect("/reviews/manage")
}

module.exports = {
  buildReviewForm,
  addReview,
  buildManageReviews,
  deleteReview
}