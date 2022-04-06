//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const router = require('./router');

const aboutContent = "A blog is often the product of a content management system. Whether a blog patron merely wants to voice their thoughts or a business wants to write persuasive copy, a blog is the place to be. Though a blog’s primary job is displaying words on the client-side, the server-side is essential to archiving blog posts as they accumulate. ";
const contactContent = "Mail Id: shivamguptasg1808@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let blogs = [];

app.get("/", function(req, res){
  //console.log("Blog Home Page");
  res.render("home_blogs", {
    blogs: blogs
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

// For Blog
app.get("/compose-blogs", function(req, res){
  res.render("compose_blogs");
});

app.post("/compose-blogs", function(req, res){
  //console.log("New Blog Created: "+ req.body.postTitle);
  const blog = {
    title: req.body.postTitle,
    content: req.body.postBody,
    post: []
  }; 

  blogs.push(blog);

  res.redirect("/");

});

app.get("/blogs/:blogName", function(req, res){
  //console.log("Inside Blog: "+ req.params.blogName);

  const requestedTitle = _.lowerCase(req.params.blogName);

  blogs.forEach(function(blog){
    const storedTitle = _.lowerCase(blog.title);

    if (storedTitle === requestedTitle) {
      res.render("blog", {
        title: blog.title,
        content: blog.content,
        posts: blog.post
      });
    }
  });

});

// For Posts
app.get("/blogs/:blogName/compose", function(req, res){
  res.render("compose", {bName: req.params.blogName});
});

app.post("/blogs/:blogName/compose", function(req, res){
  var bName = req.params.blogName;

  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  }; 

  blogs.forEach(function(blog){
    if(bName === blog.title){
      blog.post.push(post);
    }
  })

  //blogs.bName.post.push(post);

  console.log("Post: ",post);
  console.log("bName: " + bName);
  console.log("Blogs: ",blogs);

  res.redirect("/blogs/"+bName);

});

app.get("/blogs/:blogName/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  blogs.forEach(function(blog){
    const storedTitle = _.lowerCase(blog.post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: blog.post.title,
        content: blog.post.content
      });
    }
  });

});

app.use('/upload', router);

app.listen(3000, function() {
  console.log("Server started on port 3000");
});