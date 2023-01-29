const express = require("express");
const Post = require("../models/post");
const router = express.Router();
const mongoose = require('mongoose');

router.post('', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    console.log(post);
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully',
            postId: createdPost._id
        })
    });

});



router.get('', (req, res, next) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: "Posts fetched Successfully",
            posts: documents
        })
    })

})

router.delete('/:id', (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id.trim());
    Post.deleteOne({
        _id: id
    }).then(result => {
        console.log(result);

        res.status(200).json({
            message: "Posts Delected",
            //posts:documents
        })
    })

})

router.put('/:id', (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    })
    const id = mongoose.Types.ObjectId(req.params.id.trim());
    Post.updateOne({
        _id: id
    }, post).then(result => {
        res.status(200).json({
            message: 'Updated successfully'
        })
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
