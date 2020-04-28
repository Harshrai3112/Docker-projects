var express=require('express');
var router=express.Router();
var campground=require('../models/campground');
//==============
//Index route
//=============
router.get('/',(req,res)=>{
    campground.find({},(err,camps)=>{
        if(err){
            console.log("this is "+err);
        }else{
            res.render('campgrounds/campgrounds',{camps:camps,currentUser:req.user});
        }
    });
  
});
//=============
//New Route
//============
router.get('/new',isLoggegIn,(req,res)=>{
    res.render('campgrounds/new');
});
//============
//SHOW ROUTE
//==========
router.get('/:id',(req,res)=>{
    campground.findById(req.params.id).populate("comments").exec((err,camps)=>{
        if(err){
            console.log("campg erorrr");
            
        }else{
            res.render('campgrounds/show',{camps:camps});            
        }   
    });
});
//===============
//Create ROute
//==============
router.post('/',isLoggegIn,(req,res)=>{
    var name=req.body.name;
    var img=req.body.image;
    var desc=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    };
    var camp={name:name,image:img,description:desc,author:author};
    campground.create(camp,(err,camps)=>{
        if(err){
            console.log(err);
            
        }else{
            res.redirect('/campgrounds');
        }
    });
    
    
});
//=========================
//    Edit Route
//=========================
router.get('/:id/edit',checkUserAuthorization,(req,res)=>{
    
    campground.findById(req.params.id,(err,camp)=>{
        if(err){
            res.render("campgrounds/show");
        }else{
            res.render("campgrounds/edit",{camp:camp}); 
        }
    });
    
    
});
//====================
//      Update
//====================
router.put("/:id",checkUserAuthorization,(req,res)=>{
    campground.findByIdAndUpdate(req.params.id,req.body.camps,(err,camp)=>{
        if(err){
            res.send("Not updated!!!! Try Again");
        }else{
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});
//===========================
//    Delete Route
//==========================
router.delete("/:id",checkUserAuthorization,(req,res)=>{
    campground.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            res.send("Not Deleted");
        }else{
            res.redirect('/campgrounds');

        }
    });
});
function checkUserAuthorization(req,res,next){
    if(req.isAuthenticated()){
        campground.findById(req.params.id,(err,camp)=>{
            if(err){
                res.redirect("back");
            }else{
                if(camp.author.id.equals(req.user.id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }
    else{
        res.redirect("back");
    }
}
function isLoggegIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login');
}
module.exports=router;
