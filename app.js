
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const hostname = "localhost";
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require("passport-facebook");
const findOrCreate = require('mongoose-findorcreate');

mongoose.set("strictQuery",false);

const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));

app.use(session({
    secret:"Our Little Secret.",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB)
    .then(()=>{
        console.log("MongoDB Server Connected");
    })
    .catch((error)=>{
        console.log("Error Connecting to MongoDB");
        console.log(error);
    });

const userSchema = new mongoose.Schema({
    username:String,
    googleId: String,
    facebookId: String,
    entries: [{
        title: String,
        content: String,
        date: String
    }]
},{timestamps:true});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User =new mongoose.model("User",userSchema)

passport.use(User.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.username, name: user.name });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `http://${hostname}:3000/auth/google/diary`,
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ username: profile.displayName,googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `http://${hostname}:3000/auth/facebook/diary`
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ username:profile.displayName,facebookId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.shashi = 'Rahul';
    next();
})
app.get("/",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("home",{username:req.user.username, loginf:"LogOut"})
    }else{
        res.render("home",{ username : "User", loginf:"LogIn" });

    }
});

/* ----------------------Google Route--------------------------------------------------------------- */

app.get("/auth/google",passport.authenticate("google",{scope:["profile"]}));

app.get("/auth/google/diary",
    passport.authenticate('google', { failureRedirect: "/login" }),
    function(req, res) {
        // Successful authentication, redirect diary.
        res.redirect('/diary');
    });

/* ----------------------Facebook Route-------------------------------------------------------- */

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/diary',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/diary');
    });


//--------------------Diary Route---------------------------------------------------

app.get("/diary",(req, res)=>{
    if(req.isAuthenticated()) {
        console.log(req.user);
        User.findById(req.user.id)
            .then((result) => {
                if (result) {
                    res.render("diary", {username: req.user.username, loginf:"LogOut", entries: result.entries });
                } else {
                    console.log("No Such User Found");
                }
            })
            .catch((error) => {
                if (error) {
                    console.log("Error Searching For User in Diary Get Route");
                }
            });
    }else{
        res.redirect("/LogIn");
    }
});

//---------------------Entries Route ------------------------------------

app.get("/MyEntries",(req, res)=>{
    // console.log(req.path);
    if(req.isAuthenticated()) {
        console.log(req.user);
        User.findById(req.user.id)
            .then((result) => {
                if (result) {
                    res.render("entries", {username: req.user.username, loginf:"LogOut", entries: result.entries });
                } else {
                    console.log("No Such User Found");
                }
            })
            .catch((error) => {
                if (error) {
                    console.log("Error Searching For User in Diary Get Route");
                }
            });
    }else{
        res.redirect("/LogIn");
    }
});


app.post("/MyEntries",(req,res)=>{
    const dt = new Date();
    const entry = {
        title:req.body.title,
        content:req.body.content,
        date: dt.toLocaleString()
    }
    User.findById(req.user.id)
        .then((result)=>{
            if (result){
                result.entries.push(entry);
                result.save(()=>{
                    res.redirect("/MyEntries");
                });
            }
        })
        .catch((error)=>{
            if(error){
                console.log("Error finding User During DiaryPost\n"+error);
        }});
});

/*------------------------------Register Route----------------------------------*/

app.get("/register",(req,res)=>{
    if(req.isAuthenticated()){
        res.redirect("/diary");
    }else{
        res.render("register",{ username : "User", loginf:"LogIn" });
    }
});

app.post("/register",(req,res)=>{
    User.register({username:req.body.username},req.body.password,(error,user)=>{
        if(error){
            console.log(error);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/diary");
            })
        }
    });
});

//----------------------Login Route---------------------------//

app.get("/LogIn",(req,res)=>{
    if(req.isAuthenticated()){
        res.redirect("/diary");
    }else{
        res.render("login",{ username: "User", loginf:"LogIn"});
    }
});

app.post("/LogIn",(req,res)=>{
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user,(err)=>{
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/diary");
            });
        }
    });
});

//------------------------------------LOGOUT-------------------------------------------------//

app.get("/LogOut", function(req, res, next) {
    req.logout(function(err) {
        if (err) {
            console.log(err);
        }else{
            res.redirect('/');
        }

    });
});

//-----------------------------Pricing Route -------------------------------------------//

app.get("/pricing",(req, res)=>{
    if(req.isAuthenticated()){
        res.render("pricing",{username: req.user.username, loginf:"LogOut" });
    }else{
        res.redirect("LogIn");
    }
});

app.post("/pricing",(req, res)=>{
    const amount = req.body.btn;
    res.render("payments",{username:req.user.username,loginf:"LogOut",userid:req.user.id, amount:amount});
});

app.post("/payments",(req, res)=>{
    const msg = {
        username:req.body.username,
        userid:req.body.userid,
        date:new Date(),
        amount:req.body.amount,
        msg:"Payment Details Submitted successfully, Your Account will be Upgraded Soon! "
    }
    res.send(msg);
});

//---------------------------------------------editEntry Route--------------------------//
app.post("/editEntry",async (req, res)=>{
    const dt = new Date();
    const id = req.body.entryId;
    if(req.body.delete){
        await User.findOneAndUpdate({ _id : req.user.id},{$pull:{entries:{_id:id}}})
            .then(()=>{
                console.log("Sucessfully Deleted.");
                res.redirect("/MyEntries");
            })
            .catch((error)=>{
                if(error){
                    console.log("Error Deleting Entries.");
                    console.log(error);
                }
            });
    }else{
        await User.findOneAndUpdate({_id:req.user.id, "entries._id" : id },{$set:{"entries.$.title":req.body.title,"entries.$.date":dt.toLocaleString(), "entries.$.content":req.body.content,date:dt}})
            .then(()=>{
                console.log("Successfully Updated.");
                res.redirect("/diary");
            })
            .catch((error)=>{
                if(error){
                    console.log("Error Updating Database in EditEntryPost Route.");
                }
            });
    }
});

//------------Settings Route------------------------------//
app.get("/details",(req, res)=>{
    if(req.isAuthenticated()){
        res.render("account",{username:req.user.username, loginf:"LogOut", email:"email@gmail.com"});
    }else{
        res.redirect("/LogIn");
    }
})

//'10.31.45.187',
app.listen(3000,()=>{
    console.log("Server Started on port 3000");
});
