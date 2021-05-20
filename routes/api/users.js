const express = require("express");
const router = express.Router();
const { registerPost,loginPost, current_user } = require('../../controllers/userContoller')

const jwt = require("jsonwebtoken");
const passport = require("passport");



// @route POST api/users/register
// @description register post route
// @access public
router.post("/register", registerPost);

// @route POST api/users/login
// @description login post route
// @access public
router.post("/login",loginPost);

// @route GET api/users/current
// @description return current user
// @access private
router.get("/current",passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
});


module.exports = router;
