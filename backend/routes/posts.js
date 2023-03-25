const express = require("express");
const PostsController = require("../controller/posts")
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth')
const extractFile = require('../middleware/file')

router.post('',
checkAuth,
 extractFile,
 PostsController.createPost 
);

router.get('', PostsController.getPosts)

router.delete('/:id',checkAuth, PostsController.deletePost)

router.put('/:id', checkAuth, extractFile,
PostsController.updatePost
)

router.get('/:id', PostsController.getPost)

module.exports = router;
