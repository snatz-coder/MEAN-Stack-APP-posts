
const express = require('express');

const mongoose = require('mongoose');
const Post = require('./models/post')
const app = express();

mongoose.connect("mongodb+srv://Naizel25:Naizel25@cluster0.9kw8f.mongodb.net/node-angular?retryWrites=true&w=majority")
    .then(() => {
        console.log('connected to the database!')
    }).catch(() => {
        console.log("connection failed")
    })



const bodyParser = require("body-parser");
const post = require('./models/post');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers',
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader('Access-Control-Allow-Methods',
        "GET, POST, PATCH, PUT, DELETE, OPTIONS")
    next();
})

app.post('/api/posts', (req, res, next) => {
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



app.get('/api/posts', (req, res, next) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: "Posts fetched Successfully",
            posts: documents
        })
    })

})

app.delete('/api/posts/:id', (req, res, next) => {
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

app.put('/api/posts/:id', (req, res, next) => {
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

app.get('/api/posts/:id', (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id.trim());
    Post.findById(id).then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: 'Post not found' })
        }

    })
})

app.use('/api/posts', (req, res, next) => {
    const posts = [
        {
            id: 'ertyu',
            title: 'First server-side post',
            content: 'This is coming from the server'
        },
        {
            id: 'ertyu33',
            title: 'Second server-side post',
            content: 'This is coming from the server'
        },
    ]
    res.status(200).json({
        message: 'Posts sent successfully',
        posts: posts
    })
});



module.exports = app;