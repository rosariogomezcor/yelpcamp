var express = require("express"), 
 	app = express(), 
	bodyParser = require("body-parser"), 
	mongoose = require("mongoose"), 
	Campground = require("./models/campground"), 
	Comment = require("./models/comment"), 
	seedDB = require("./seeds"), 
	passport = require("passport"), 
	LocalStrategy = require("passport-local"), 
	User = require("./models/user");

//requiring routes
var commentRoutes = require("./routes/comments"), 
	campgroundRoutes = require("./routes/campgrounds"), 
	indexRoutes = require("./routes/index"); //index = auth

mongoose.connect("mongodb://localhost:27017/yelp_camp_v3", {useNewUrlParser: true} ); 	
app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine", "ejs"); 
app.use(express.static(__dirname + "/public")); 
// seedDB(); 	//seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "This is the top secret string", 
	resave: false, 
	saveUninitialized: false
})); 

app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

//middleware to pass to all routes the current logged in user
app.use(function(req, res, next) {
	res.locals.currentUser = req.user; 
	next(); 
}); 

//express router
app.use("/", indexRoutes); 
app.use("/campgrounds", campgroundRoutes); 
app.use("/campgrounds/:id/comments", commentRoutes); 

//server listening...
app.listen(3000, function() {
	console.log("YelpCamp server has started...");
}); 