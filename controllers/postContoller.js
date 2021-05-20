const passport = require('passport')
const mongoose = require('mongoose')
const isValidObjectId = require('../validation/objectId')
//  Load Input Validation
const validatePostInput = require("../validation/post");

// Load Post And Profile model
const {Post} = require("../models/Post");
const {Profile} = require("../models/Profile");

module.exports = {
  // Create post
  create_post: async(req, res)=>{

    const { errors, isValid } = validatePostInput(req.body)
    if(!isValid){
      return res.status(400).json(errors)
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id 
    })

    newPost.save()
      .then(post=> res.json(post))
  },

  // Get all post
  get_all_post: async(req, res)=>{
    Post.find()
      .sort({date: -1})
        .then(posts=>res.json(posts))
        .catch(err=>res.status(404).json({nopost : 'No post available at this time'}))
  },

  // Get single post by ID
  get_post_byID: async(req, res)=>{
    if(!isValidObjectId(req.params.id)){
      res.json({message: 'invalid post Id'})
    }
    else{
      await Post.findById(req.params.id)
      .then(post=> {
        if(post) {
          res.json(post)
        }
        else{
          res.status(404).json({nopost : 'No post with this id'})
        }
      })
      .catch(err=>res.status(404).json({nopost : 'No post with this id'}))
    }
  },

  // Delete a Post
  delete_post: async(req, res)=>{
    await Profile.findOne({user : req.user.id})
      .then(profile =>{
        if(!isValidObjectId(req.params.id)){
            res.json({message: 'invalid post Id'})
        }
        else{
          Post.findById(req.params.id)
          .then(post =>{
            if (post.user.toString() !== req.user.id){
              return res.status(401).json({notauthorized : 'User not authorized'})
            }
            else{
              post.remove()
                .then(()=> res.status(200).json({
                  success: true,
                  message: 'Post deleted successfully'
                }))
                .catch(err=> res.status(404).json({
                  success: false,
                  message: 'Post deletion failed'
                }))
             }
          })
            .catch(err => res.status(404).json({ nopost : 'No post with this id'})) 
        }
      })
  },

  // Like And Unlike a Post
  like_unlike_post: async(req, res)=>{
    await Profile.findOne({user : req.user.id})
      .then(async profile =>{
        if(!isValidObjectId(req.params.id)){
            res.json({message: 'invalid post Id'})
        }
        else{
          await Post.findById(req.params.id)
          .then(post =>{
            if(post){
              if (post.user.toString() === req.user.id){
                return res.json({message : 'you can not like your post'})
              }
              if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                post.likes.unshift({user: req.user.id})
                post.save()
                .then(post => res.json(post))
                .catch(err => res.json(err))
              }
              else{
                    // Get index of like to remove from likes array
                const remove_index = post.likes
                  .map(likes => likes.user.toString())
                  .indexOf(req.user.id)

                // Splice the like out of the array
                post.likes.splice(remove_index, 1)
                post.save()
                  .then(post => res.json(post))
                  .catch(err => res.json(err))
              }
            }
            else{
              return res.status(404).json({nopost : 'No post with this id'})
            } 
          })
          .catch(err => res.status(404).json(err)) 
        }
      })
  },
  

  // comment on a Post
  comment_post: async(req, res)=>{

    const { errors, isValid } = validatePostInput(req.body)
    if(!isValid){
      return res.status(400).json(errors)
    }

    if(!isValidObjectId(req.params.id)){
        res.json({message: 'invalid post Id'})
    }
    else{
      await Post.findById(req.params.id)
      .then(post =>{
        if(post){
          //  new comment instance
          const newComment = {
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
          }
          post.comments.unshift(newComment)
          post.save()
            .then(comment =>res.json(comment))
            .catch(err =>res.json({message: 'commenting failed'}))
        }
        else{
          return res.status(404).json({nopost : 'No post with this id'})
        } 
      })
      .catch(err => res.status(404).json({nopost : 'No post with this id'}))
    }
  },

  // Edit a post 
  edit_post: async(req, res)=>{

    const { errors, isValid } = validatePostInput(req.body)
    if(!isValid){
      return res.status(400).json(errors)
    }

    if(!isValidObjectId(req.params.id)){
        res.json({message: 'invalid post Id'})
    }
    else{
      let editedContent = req.body
      let _id = req.params.id
      await Post.findByIdAndUpdate({_id}, editedContent)
      .then((edited_post) =>{
        console.log(edited_post)
        if(edited_post.user.toString() !== req.user.id){
          return res.status(401).json({notauthorized : 'User not authorized'})
        }
        else{
          edited_post.save()
            .then(edited_post =>res.json(edited_post))
            .catch(err =>res.json({message: 'Editing failed'})) 
        } 
      })
      .catch(err => res.status(404).json(err))
    }
  },

  // Like a Post
  // like_post: async(req, res)=>{
  //   await Profile.findOne({user : req.user.id})
  //     .then(async profile =>{
  //       if(!isValidObjectId(req.params.id)){
  //           res.json({message: 'invalid post Id'})
  //       }
  //       else{
  //         await Post.findById(req.params.id)
  //         .then(post =>{
  //           if(post){
  //               if (post.user.toString() === req.user.id){
  //                 return res.json('you can not like your post')
  //               }
  //               if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
  //                 return res.status(400).json({alreadyliked : 'post already liked'})
  //               }
  //               else{
  //                 post.likes.unshift({user: req.user.id})
  //                   post.save()
  //                   .then(post => res.json(post))
  //                   .catch(err => res.json(err))
  //               }
  //           }
  //           else{
  //             return res.status(404).json({nopost : 'No post with this id'})
  //           } 
  //         })
  //         .catch(err => res.status(404).json(err))
  //       }
  //     })
  // },


}
