const express = require('express')
const router  = express.Router()
const passport = require('passport')
const {current_user_profile, create_profile, all_profiles, Get_profile_handle, Get_profile_user_id, experience_post,education_post, delete_experience, delete_education, delete_User_and_Profile} = require('../../controllers/profileController')
const auth = require('../../config/auth')




// @route GET api/profile
// @description GET current user's profile
// @access private
router.get('/',auth ,current_user_profile)


// @route GET api/profile/all
// @description GET array of all profiles 
// @access public
router.get('/all', all_profiles)


// @route GET api/profile/handle/:handle
// @description GET profile by handle
// @access public
router.get('/handle/:handle', Get_profile_handle)


// @route GET api/profile/user/:user_id
// @description GET profile by ID
// @access public
router.get('/user/:user_id', Get_profile_user_id)


// @route POST api/profile
// @description Create user's profile
// @access private
router.post('/',auth ,create_profile)


// @route POST api/profile/experience
// @description add user experience to profile
// @access private
router.post('/experience',auth ,experience_post)


// @route POST api/profile/education
// @description add user education to profile
// @access private
router.post('/education',auth ,education_post)


// @route DELETE api/profile/experience/:exp_id
// @description Delete experience from user profile
// @access private
router.delete('/experience/:exp_id',auth ,delete_experience)


// @route DELETE api/profile/education/:exp_id
// @description Delete education from user profile
// @access private
router.delete('/education/:edu_id',auth ,delete_education)


// @route DELETE api/profile
// @description Delete User and Profile
// @access private
router.delete('/',auth ,delete_User_and_Profile)


module.exports = router