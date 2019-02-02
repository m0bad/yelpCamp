var mongoose                =require("mongoose");
var passportLocalMongoose   =require("passport-local-mongoose");


 var UserSChema = new mongoose.Schema({
     username:String,
     password:String
 });
 
 
 UserSChema.plugin(passportLocalMongoose);
 
 module.exports=mongoose.model("User",UserSChema);