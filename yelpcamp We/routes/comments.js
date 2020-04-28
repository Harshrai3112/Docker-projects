var express=require('express');
var router=express.Router({mergeParams:true});
var campground=require('../models/campground');
var Comment=require('../models/comment');
//========================
// new route for comments
//========================
router.get('/new',isLoggegIn,(req,res)=>{
    campground.findById(req.params.id,(err,camp)=>{
        if(err){
            console.log("Comment error");
            
        }else{
            res.render('comments/new',{camp:camp});
        }
    })
    
});
//==========================
//create route for comments
//=========================
router.post('/',(req,res)=>{
    // console.log(req.params.id);
    
    campground.findById(req.params.id,(err,camp)=>{
        if(err){
            console.log("Campground not found");
            res.redirect('/campgrounds');
            
        }else{
            Comment.create(req.body.comment,(err,comment)=>{
                if(err){
                    console.log("comment not created");
                    
                }else{
                    // console.log(req.user.username);
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect('/campgrounds/'+camp._id);
                }
            });
        }
    });
});
//===========================
// Edit Route for comments
//===========================
router.get('/:idComm/edit',checkUserAuthorization,(req,res)=>{
    Comment.findById(req.params.idComm,(err,comment)=>{
        if(err){
            res.redirect('/campgounds');
        }else{
            campground.findById(req.params.id,(err,camp)=>{
                if(err){
                    console.log("campground err");
                }else{
                    res.render("comments/edit",{comment:comment,camp:camp});
                }
            })
                  }
    });
});
//=============================
//   Update Route for Comments
//==============================
router.put('/:idComm',checkUserAuthorization,(req,res)=>{
    Comment.findByIdAndUpdate(req.params.idComm,req.body.comment,(err,comm)=>{
        if(err){
            res.redirect('/campgrounds');
        }else{
            campground.findById(req.params.id,(err,camp)=>{
                res.redirect('/campgrounds/'+camp._id);
            });
           
        }
    })
})
//============================
//   Delete Route
// ===========================
router.delete('/:idComm',checkUserAuthorization,(req,res)=>{
    Comment.findByIdAndRemove(req.params.idComm,(err)=>{
        campground.findById(req.params.id,(err,camp)=>{
            res.redirect('/campgrounds/'+camp._id);
        })
    });
});
function checkUserAuthorization(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.idComm,(err,comment)=>{
            if(err){
                res.redirect("back");
            }else{
                if(comment.author.id.equals(req.user._id)){
                    next();
                }else{
                    
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
}
//===================
//MiddleWare
//===================
function isLoggegIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}
module.exports=router;