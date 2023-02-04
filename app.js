//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash") ;

// let blogArr = [] ;
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/BlogWebsite" );
// mongoose.connect("mongodb://127.0.0.1:27017/BlogWesite" );

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const blogSchema = {
  title: String,
  content: String
};

const Blog = mongoose.model("Blog", blogSchema);

app.get("/" , (req , resp ) =>{
  Blog.find({} , function (err, docs) {
    resp.render("home",{
    blogArr   : docs
    });
  });
});

app.get("/compose" , (req , resp ) =>{
  resp.render("compose");
})
app.post("/compose" , (req , resp ) =>{
  const blog = new Blog ({
    title:req.body.postTitle,
    content:req.body.postBody
  });
  blog.save((err)=>{
    if(!err){resp.redirect("/");}
  })
});

app.get("/post/:postId" , (req , resp ) =>{
  const requestedPostId = req.params.postId;
  Blog.findOne({_id : requestedPostId } , function (err, docs) {
    if (!err){
        resp.render("post",{
          title : docs.title,
          content : docs.content
        });
    } else {console.log(err);}
  });
})

app.get("/about" , (req , resp ) =>{
  resp.render("about");
})

app.get("/contact" , (req , resp ) =>{
  resp.render("contact");
})

app.listen(  process.env.PORT  || 3000, function() {
  console.log("Server started on port 3000");
});
