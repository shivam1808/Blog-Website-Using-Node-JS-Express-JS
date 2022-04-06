//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

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

app.listen(3000, function() {
  console.log("Server started on port 3000");
});