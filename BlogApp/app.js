var express     =require('express'),
    app         =express(),
    mongoose    =require("mongoose"),
    bodyParser  =require("body-parser"),
    methodOverride=require("method-override"),
    expressSanitizer=require('express-sanitizer');

mongoose.connect("mongodb://mongo/blog_app",{useNewUrlParser:true});
app.set("view engine",'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
var schema=new mongoose.Schema({
    title:String,
    body:String,
    image:String,
    created:{type:Date,default:Date.now}
});
var blog=mongoose.model("Blog",schema);

//HOME PAGE
app.get('/',(req,res)=>{
    res.redirect('/blogs');
});
//INDEX ROUTE :- /BLOGS
app.get('/blogs',(req,res)=>{
    blog.find({},(err,blogs)=>{
        if(err){
            console.log("Error");
            
        }else{
            res.render("index",{blogs:blogs});
        }
    })
    
});
//NEW ROUTE :- /BLOGS/NEW
app.get('/blogs/new',(req,res)=>{
    // res.send("hello guys");
    res.render('new');

});
//SHOW ROUTE :- /BLOGS/:ID
app.get('/blogs/:id',(req,res)=>{
    // res.send('isys working');
    blog.findById(req.params.id,function(err,blog){
        if(err){
            console.log("ERROR");
        }else{
            res.render('show',{blog:blog});
        }
    });
});
//EDIT ROUTE :- /BLOGS/:ID/EDIT
app.get('/blogs/:id/edit',(req,res)=>{
    blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            res.redirect('/blogs');
        }else{
            res.render('update',{blog:foundBlog});
        }
    });
});
//CREATE ROUTE:- /BLOGS(POST)
app.post('/blogs',(req,res)=>{
    blog.create(req.body.blog,(err,blog)=>{
        if(err){
            console.log("ERROR");
            
        }else{
            res.redirect('/blogs');
        }
    });
});
//UPDATE ROUTE :/BLOGS(PUT)
app.put('/blogs/:id',(req,res)=>{
    // res.send("UPfayed");
    blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
        if(err){
            res.redirect('/blogds');
        }else{
            res.redirect('/blogs/'+req.params.id);
        }
    })
});
//DELET ROUTE : /BLOGS/:ID (DELETE)
app.delete('/blogs/:id',(req,res)=>{
    // res.send(" its deleted");
    blog.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            res.redirect('/blogs');
        }else{
            res.redirect('/blogs');
        }
    });
});
app.listen(4000,()=>{
    console.log("i am listening");
});
