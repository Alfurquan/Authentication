var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var User = require("./models/user")
var bodyParser = require("body-parser");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost:27017/auth_demo" , { useNewUrlParser: true});
var app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
    secret:"I love node",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//=========================
//Routes
//==========================
app.get("/",function(req,res){
    res.render("home")
});

app.get("/secret",isLoggedIn,function(req,res){
    res.render("secret");
});

//register routes
app.get("/register",function(req, res) {
    res.render("register");
});
//sign up user
app.post("/register",function(req,res){
    req.body.username
    req.body.password
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function(){
              res.send(user);
            });
        }
    })
})

//login routes
app.get("/login",function(req, res) {
    res.render("login");
});

//logging in

app.post("/login",passport.authenticate("local"),function(req,res){
    res.send("true");
});
//logout

app.get("/logout",function(req, res) {
    req.logout();
    res.redirect("/");
})

//middleware to check for logged in
function isLoggedIn(req,res,next){
 if(req.isAuthenticated()){
     return next();
 }else{
     res.redirect("/login");
 }   
}
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server Started");
});