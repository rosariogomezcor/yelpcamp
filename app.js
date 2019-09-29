var express = require("express"), 
 	app = express(), 
	bodyParser = require("body-parser"), 
	mongoose = require("mongoose"), 
	Campground = require("./models/campground"), 
	Comment = require("./models/comment"), 
	seedDB = require("./seeds"), 
	passport = require("passport"), 
	LocalStrategy = require("passport-local"), 
	User = require("./models/user"), 
	methodOverride = require("method-override"); 

//requiring routes
var commentRoutes = require("./routes/comments"), 
	campgroundRoutes = require("./routes/campgrounds"), 
	indexRoutes = require("./routes/index"); //index = auth

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v3"; //process.env.DATABASE URL is an environment variable, both defined in heroku and in my local machine

mongoose.connect(url, { 
	useNewUrlParser: true, 
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!'); 
}).catch(err => {
	console.log('ERROR:', err.message); 
}); 

app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine", "ejs"); 
app.use(express.static(__dirname + "/public")); 
app.use(methodOverride("_method")); 
// seedDB(); 	//seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "This isthe top secret string", 
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
app.listen(process.env.PORT || 3000, function() {
	console.log("YelpCamp server has started on port " + process.env.PORT);
}); 