const express = require("express")
const router = express.Router()
const reviewController = require("../controllers/reviewController")
const reviewValidate = require("../utilities/review-validation")
const utilities = require("../utilities")
const { checkJWT, checkEmployeeOrAdmin } = require("../utilities/account-middleware")

// Add review form (protected)
router.get("/add/:inv_id", checkJWT, utilities.handleErrors(reviewController.buildReviewForm))

// Process review
router.post("/add", 
  checkJWT,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
)

// Manage reviews (Admin/Employee only)
router.get("/manage", checkEmployeeOrAdmin, utilities.handleErrors(reviewController.buildManageReviews))

// Delete review (Admin/Employee only)
router.get("/delete/:review_id", checkEmployeeOrAdmin, utilities.handleErrors(reviewController.deleteReview))

module.exports = router