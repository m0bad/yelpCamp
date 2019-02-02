var express     =require("express");
var router      =express.Router();
var Campground  =require("../models/campground");
var Comment     =require("../models/comment");
var middleware  =require("../middleware");//automatically will require the index file (could also required  /index.js ^_^)




 //COMMENTS NEW
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req, res) {
   //FIND CAMPGROUND BY ID
   Campground.findById(req.params.id,function(err,campground){
       if(err){
           console.log(err);
       }
       else{
            res.render("comments/new",{campground:campground}); 
       }
   });
});

//COMMENTS CREATE
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
    //lookup campground using id 
    Campground.findById(req.params.id,function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            //create a new comment 
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                    //add username and id to a comment
                    comment.author.id       =req.user._id;
                    comment.author.username =req.user.username;
                    //save comment
                    comment.save();
                    //connect a new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfuly added comment");
                    //redirect to campground show page      
                    res.redirect("/campgrounds/"+campground._id); 
                }
            });

        }
    });

});


//COMMENTS EDIT
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err, foundComment) {
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
        }
    });
});

//COMMENTS UPDATE
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
    
});



//COMMENTS DESTROY ROUTES
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,req.body,function(err){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success","comment deleted!");
            res.redirect("/campgrounds/"+req.params.id);
        }

    });
});







module.exports=router;