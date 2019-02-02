var express     =require("express");
var router      =express.Router();
var Campground  =require("../models/campground");
var middleware  =require("../middleware");//automatically will require the index file (could also required  /index.js ^_^)

//INDEX -- show all campgrounds
router.get("/campgrounds",function(req,res){
        Campground.find({},function(err,allCampgrounds){
            if (err){
                console.log("ERROR:");
                console.log(err);
            } 
            else{
                res.render("campgrounds/index",{campGrounds:allCampgrounds,CurrentUser:req.user});
            }
        });
       
});

//CREATE --add new campgrounds to the database
router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
   var name=req.body.name;
   var image=req.body.image;
   var discription=req.body.discription;
   var author={
     id         :req.user._id,
     username   :req.user.username
   };
   var newCampGround={name:name,image:image,discription:discription,author:author};
   //CREATE A NEW CAMPGROUND AND SAVE IT TO THE DATABASE
    Campground.create(newCampGround,function(err,newlyCreated){
       if(err){
           console.lg(err);
       } 
       else{
            //redirect back to campground page
            res.redirect("/campgrounds");         
       }
    });

    });
  
//NEW --show form to create new campground  
router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
   res.render("campgrounds/new"); 
});

//SHOW --shows more info about one campground
router.get("/campgrounds/:id",function(req,res){
   //find the campground with the provided id
   Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
    if(err){
        console.log(err);
    } 
    else{
        //render show templates with that campground
        res.render("campgrounds/show",{campground:foundCampground});        
    }
   });

});


//EDIT CAMPGROUND ROUTES

router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                console.log(err);
            }else{
                res.render("campgrounds/edit",{campground:foundCampground}) ;
            }
        
    });      

});

//UPDATE CAMPGROUND ROUTES

router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/campgrounds");
       }
       else{
           res.redirect("/campgrounds");
       }
   }) ;
});





module.exports=router;