const jwt = require('passport-jwt')
const passport = require('passport')

const auth = passport.authenticate("jwt", { session: false })

module.exports = auth