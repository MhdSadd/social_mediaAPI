const passport = require('passport')
const mongoose = require('mongoose')

//  Load Input Validation
const validateProfileInput = require("../validation/profile");
const validateExperienceInput = require("../validation/experience");
const validateEducationInput = require("../validation/education");



// Load models
const {User} = require("../models/User");
const {Profile} = require("../models/Profile");

module.exports = {

    // =============current user's profile controller========================
    current_user_profile: async(req, res)=>{
      const errors = {}
      Profile.findOne({user: req.user.id})
        .populate('user', ['name'])
        .then(profile=>{
          if(!profile){
            errors.noprofile = 'There is no profile for this user'
            return res.status(400).json(errors)
          }
          else{
            res.status(200).json(profile)
          }
        })
      .catch(err=>res.status(400).json(err))
    },



    // =============profile create controller========================
    create_profile: async(req, res)=>{

      const { errors, isValid } = validateProfileInput(req.body)
      if(!isValid){
        return res.status(400).json(errors)
      }
      // =============checking all incoming fields========
      const profile_fields = {}
      profile_fields.user = req.user.id
      if(req.body.handle) profile_fields.handle = req.body.handle
      if(req.body.company) profile_fields.company = req.body.company
      if(req.body.website) profile_fields.website = req.body.website
      if(req.body.location) profile_fields.location = req.body.location
      if(req.body.status) profile_fields.status = req.body.status
      // spliting incoming CSV fields into array
      if(typeof req.body.skills !== 'undefined'){ profile_fields.skills = req.body.skills.trim().split(',')
      }
      if(req.body.bio) profile_fields.bio = req.body.bio
      if(req.body.git_username) profile_fields.git_username = req.body.git_username
      // for socials
      profile_fields.socials = {}
      if(req.body.youtube) profile_fields.socials.youtube = req.body.youtube
      if(req.body.instagram) profile_fields.socials.instagram = req.body.instagram
      if(req.body.twitter) profile_fields.socials.twitter = req.body.twitter
      if(req.body.facebook) profile_fields.socials.facebook = req.body.facebook
      if(req.body.linkedin) profile_fields.socials.linkedin = req.body.linkedin

      Profile.findOne({user: req.user.id})
        .then(profile=>{
            if(profile){
              // Updating existing logged in user profile
              Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profile_fields},
                {new: true}
              )
                .then(profile=> res.json(profile))
            }else{
              // check if user handle already exist
              Profile.findOne({handle: profile_fields.handle})
              .then(profile=>{
                if(profile){
                  errors.handle = 'Handle already exist'
                  res.status(400).json(errors)
                } else {
                  new Profile(profile_fields).save()
                  .then(profile => res.json(profile))
                }
              })
            }
        })

    },



    // ==============Get all profiles===================
    all_profiles: async(req,res)=>{
      const errors = {}
      const profiles = await Profile.find()
      .populate('user', ['name', 'avatar'])
        if (!profiles) {
          errors.noprofile = 'There are no profiles'
          return res.status(404).json(errors)
        }
        else if (profiles){
          res.status(200).json(profiles)
        }
        else{
          res.status(404).json({profile: 'There are no profiles'})
        }
    },



    // ========Get profile by Handles==================
    Get_profile_handle: async(req, res)=>{
      const errors = {}
      Profile.findOne({handle: req.params.handle})
      .populate('user', ['name', 'avatar'])
        .then(profile=>{
          if(!profile){
            errors.noprofile = 'There is no profile for this user'
            return res.status(404).json(errors)
          }
          else{
            res.status(200).json(profile)
          }
      })
      .catch(err=>res.status(404).json(err))
    },



    // ========Get profile by Id==================
    Get_profile_user_id: async(req, res)=>{
      const errors = {}
      Profile.findOne({user: req.params.user_id})
      .populate('user', ['name', 'avatar'])
        .then(profile=>{
          if(!profile){
            errors.noprofile = 'There is no profile for this user'
            return res.status(404).json(errors)
          }
          else{
            res.status(200).json(profile)
          }
      })
      .catch(err=>res.status(404).json(err))
    },



    // =================Post user experience====================
    experience_post: async(req, res)=>{
      const { errors, isValid } = validateExperienceInput(req.body)
      if(!isValid){
        return res.status(400).json(errors)
      }

      Profile.findOne({user: req.user.id})
        .then(profile=>{
          if(!profile){
            errors.noprofile = 'There is no profile for this user'
            return res.status(404).json(errors)
          }
          else{
            const newExperience = {
              title: req.body.title,
              company: req.body.company,
              location: req.body.location,
              from: req.body.from,
              to: req.body.to,
              current: req.body.current,
              description: req.body.description
            }
            // adding experience to the beginning of the array
            profile.experience.unshift(newExperience)
            profile.save().then(profile => res.json(profile))
          }
        })
    },



    // =================Post user education====================
    education_post: async(req, res)=>{
      const { errors, isValid } = validateEducationInput(req.body)
      if(!isValid){
        return res.status(400).json(errors)
      }

      Profile.findOne({user: req.user.id})
        .then(profile=>{
          if(!profile){
            errors.noprofile = 'There is no profile for this user'
            return res.status(404).json(errors)
          }
          else{
            const newEducation = {
              school: req.body.school,
              degree: req.body.degree,
              field_of_study: req.body.field_of_study,
              from: req.body.from,
              to: req.body.to,
              current: req.body.current,
              description: req.body.description
            }
            // adding education to the beginning of the array
            profile.education.unshift(newEducation)
            profile.save().then(profile => res.json(profile))
          }
        })
    },



    // ================Delete experience from user profile===========
     delete_experience: (req, res)=>{
      Profile.findOne({user: req.user.id})
      .then(profile=>{
        // Get index of experience to be removed
        const remove_exp_index = profile.experience 
          .map(item=>item.id)
            .indexOf(req.params.exp_id)

            // Remove the experience
        profile.experience.splice(remove_exp_index, 1)

        profile.save()
          .then(profile=> res.json(profile))

      })
        .catch(err=> res.status(404).json(err))
    },



    // ================Delete education from user profile===========
    delete_education: (req, res)=>{
      Profile.findOne({user: req.user.id})
      .then(profile=>{
        // Get index of education to be removed
        const remove_edu_index = profile.education 
          .map(item=>item.id)
            .indexOf(req.params.edu_id)

            // Remove the education
          profile.education.splice(remove_edu_index, 1)

            profile.save()
              .then(profile=> res.json(profile))

          })
        .catch(err=> res.status(404).json(err))
    },



  // Delete user and thier entire Profile
    delete_User_and_Profile: async(req, res)=>{
      Profile.findOneAndRemove({user: req.user.id})
        .then(()=>{
          User.findOneAndRemove({_id: req.user.id})
            .then(()=>{
                res.status(200).json({
                  success: true,
                  message: 'user deleted successfully'
                })
            })
        })
    }

}


