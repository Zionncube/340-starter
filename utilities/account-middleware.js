const jwt = require("jsonwebtoken")

function checkEmployeeOrAdmin(req, res, next) {
  try {
    const token = req.cookies.jwt
    if (!token) throw new Error("Not authenticated")
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (payload.account_type === "Employee" || payload.account_type === "Admin") {
      res.locals.accountData = payload
      next()
    } else {
      req.flash("notice", "You do not have permission to access this area.")
      return res.redirect("/account/login")
    }
  } catch (err) {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

function checkJWT(req, res, next) {
  try {
    const token = req.cookies.jwt
    if (!token) throw new Error("Not authenticated")
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    res.locals.accountData = payload
    next()
  } catch (err) {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = { checkEmployeeOrAdmin, checkJWT }

