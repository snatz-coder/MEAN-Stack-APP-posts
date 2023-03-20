const express = require("express");
const multer = require("multer");
const Post = require("../models/post");
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth')

const MIME_TYPE_MAP = { 
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid){
            error = null;
        }
        cb(null, "backend/images")
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext)
    }
});

router.post('',
checkAuth,
 multer({storage: storage}).single("image"), 
 (req, res, next) => {
   const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });

    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully',
            post:{
                ...createdPost,
                id: createdPost._id,
                // title: createdPost.title,
                // content: createdPost.content,
                // imagePath: createdPost.imagePath
            }
        })
    });

});



router.get('', (req, res, next) => {
    const pageSize =  +req.query.pageSize;
    const currentPage =  +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    console.log(pageSize,currentPage)
    if(pageSize && currentPage){
      postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
    }
    postQuery.then(documents => {
        fetchedPosts = documents
        return Post.count()
    })
    .then(count => {
         res.status(200).json({
            message: "Posts fetched Successfully",
            posts: fetchedPosts,
            maxPosts:count
        }) 
    })
})

router.delete('/:id',checkAuth, (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id.trim());
    Post.deleteOne({
        _id: id,
        creator:req.userData.userId
    }).then(result => {
        if(result.n > 0){
            res.status(200).json({
                message: "Deletion Successful",
                //posts:documents
            })    
        }else{
            res.status(401).json({
                message: "Not Authorized",
                //posts:documents
            })
        }
    })

})

router.put('/:id', checkAuth, multer({storage: storage}).single("image"),
 (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }

    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator:req.userData.userId
    })

    const id = mongoose.Types.ObjectId(req.params.id.trim());
    Post.updateOne({
        _id: id,
        creator:req.userData.userId
    }, post).then(result => {
        if(result.nModified > 0){
            res.status(200).json({
                message: 'Updated successfully'
            })
        } else{
            res.status(401).json({
                message: 'Not Authorized'
            })
        }
    })
})

router.get('/:id', (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id.trim());
    Post.findById(id).then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: 'Post not found' })
        }

    })
})

module.exports = router;
