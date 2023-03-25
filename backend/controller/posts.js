const Post = require("../models/post");
const mongoose = require('mongoose');

exports.createPost =  (req, res, next) => {
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
             }
         })
     })
     .catch(error => {
         res.status(500).json({
             message: "Creating a post failed!"
         }) 
     })
 }

 exports.updatePost =  (req, res, next) => {
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
        if(result.modifiedCount > 0){
            res.status(200).json({
                message: 'Updated successfully'
            })
        } else{
            res.status(401).json({
                message: 'Not Authorized'
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't update Post!"
        }) 
    })
}

exports.getPost = (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id.trim());
    Post.findById(id).then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: 'Post not found' })
        }

    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching post failed!"
        }) 
    })
}

exports.getPosts = (req, res, next) => {
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
    .catch(error => {
        res.status(500).json({
            message: "Fetching posts failed!"
        }) 
    })
}

exports.deletePost = (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id.trim());
    Post.deleteOne({
        _id: id,
        creator:req.userData.userId
    }).then(result => {
        if(result.deletedCount > 0){
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
    .catch(error => {
        res.status(500).json({
            message: "Deleting post failed!"
        }) 
    })

}