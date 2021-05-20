// const { secretOrKeys } = require("../../config/keys");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

//  Load Input Validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Load user
const {User} = require("../models/User");
const keys = require("../config/configurations");


module.exports ={

  registerPost:  (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body)
    if(!isValid){
      res.status(400).json(errors)
      return
    }
    // const {name, email}= req.body
    // console.log(req.body)
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        errors.email = 'Email already exist'
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200", //size
          r: "pg", //Ratings
          d: "mm", //Default
        });
        newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password,
        });
  
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
          });
        });
      }
    });
  },


  loginPost:  (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body)
    if(!isValid){
      res.status(400).json(errors)
      return
    }
    const email = req.body.email;
    const password = req.body.password;
  
    // Find user by mail
    User.findOne({ email }).then((user) => {
      if (!user) {
        errors.email = 'User not found'
        return res.status(404).json(errors);
      }
  
      //:::::::::::::::::: Compare plain password to hashed::::::::::::::::
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          //::::::::::::::::: Generating JWT token when user signIn pass::::::::::::
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          }
          
      //::::::::::::::::::::::: signing Token:::::::::::::::::::::::::::
      jwt.sign(payload, keys.secretOrKey,{ expiresIn: 3600 },(err, token) => {
        if(err) res.status(400).json({
          message:"An error occur",
          err
        })
            else{
            res.status(200).json({
              success: true,
              token: "Bearer " + token,
            });
            }
          }
        );
        } else {
          // errors.password = 'password incorrect'
          return res.status(400).json({
            msg: "password incorrect",
            success: false,
          });
        }
      });
    });
  },

  // current_user : (req, res) => {
  // passport.authenticate("jwt", { session: false }),
  //   (req, res) => {
  //     res.json({
  //       id: req.user.id,
  //       name: req.user.name,
  //       email: req.user.email,
  //     });
  //   }
  // }

}