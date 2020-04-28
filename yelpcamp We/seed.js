var mongoose=require('mongoose');
var campground=require('./models/campground');
var Comment=require('./models/comment');
var data=[
    {
        name:"Taj Mahal",
        image:'https://images.unsplash.com/photo-1506462945848-ac8ea6f609cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1952&q=80',
        description:"This is One of the seven wonder of world"
    },
    {
        name:"RED FORT",
        image:'https://images.unsplash.com/photo-1534393509365-737f836e544e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        description:"This is not the wonder of world"
    }
]
function seedDB(){
    Comment.remove({},(err)=>{
        if(err){
            console.log("comment removal error");
            
        }
        else{
            console.log("comments removed");
            
        }
    })
    campground.remove({},(err)=>{
        if(err){
            console.log("removing error");
        }
        else{
            console.log("removed Campground");
            data.forEach((camps)=>{
                campground.create(camps,(err,camps)=>{
                    if(err){
                        console.log("Creation error");
                        
                    }else{
                        console.log("Campgroud added");
                        Comment.create({
                            text:"THis is the best place to visit",
                            author:"Homer"
                        },(err,comment)=>{
                            if(err){
                                console.log("comments error");
                                
                            }else{
                                camps.comments.push(comment);
                                camps.save();
                                console.log("comment created");
                           }
                        })   ;
                    }
                });
            });
        }
    });
    
}
module.exports=seedDB;