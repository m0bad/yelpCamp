var express         =require("express");
var bodyParser      =require("body-parser");
var app             =express();
var mongoose        =require("mongoose");
var Campground      =require("./models/campground");
var Comment         =require("./models/comment");
var User            =require("./models/user");
var seedDB          =require("./seeds");
var passport        =require("passport");
var LocalStrategy   =require("passport-local");
var methodOverride  =require("method-override");
var flash           =require("connect-flash");

var commentRoutes   =require("./routes/comments"),
    campgroundRoutes=require("./routes/campground"),
    indexRoutes     =require("./routes/index");


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Setting Up The DataBase

//seedDB();
mongoose.connect("mongodb://mobad:bad*mm.ah20@ds119445.mlab.com:19445/myyelpcamp");

//mongoose.connect("mongodb://localhost/yelp_camp");


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"barca BARCA!!",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//THE GLOBAL SENDER
//IMPORTANT : DON'T FORGET 
    //WILL ADD TO EVERY SINGLE TEMPLATE
    //MEANING THAT THE ALL WILL HAVE  A CURRENT USER
app.use(function(req,res,next){
    res.locals.CurrentUser=req.user;
    res.locals.error =req.flash("error");
    res.locals.success =req.flash("success");
    next();
});



app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);
//"/campgrounds/:id/comments",
app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server Started!!"); 
});