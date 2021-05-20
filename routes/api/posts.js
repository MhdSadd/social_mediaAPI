const express = require('express')
const router = express.Router()
const {create_post, get_all_post, get_post_byID, delete_post, like_post, like_unlike_post, comment_post, edit_post} = require('../../controllers/postContoller')
const auth = require('../../config/auth')



// @route POST api/posts
// @description create post
// @access private
router.post('/', auth, create_post)

// @route GET api/posts
// @description get all post
// @access public
router.get('/', get_all_post)


// @route GET api/posts/:post_ID
// @description get all post
// @access public
router.get('/:id', get_post_byID)

// @route DELETE api/posts/:post_ID
// @description delete post
// @access private
router.delete('/:id', auth, delete_post)

// @route POST api/posts/like-unlike/:post_ID
// @description like-unlike post
// @access private
router.post('/like-unlike/:id', auth, like_unlike_post)

// @route POST api/posts/comment/:post_ID
// @description comment a post
// @access private
router.post('/comment/:id', auth, comment_post)

// @route PUT api/posts/:post_ID
// @description edit a post
// @access private
router.post('/edit/:id', auth, edit_post)

// @route LIKE api/posts/like/:post_ID
// @description like post
// @access private
// router.post('/like/:id', auth, like_post)



module.exports = router