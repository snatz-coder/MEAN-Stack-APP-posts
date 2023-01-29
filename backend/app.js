
const express = require('express');

const mongoose = require('mongoose');
const postsRoutes = require("./routes/posts");
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


app.use("/api/posts",postsRoutes)


module.exports = app;