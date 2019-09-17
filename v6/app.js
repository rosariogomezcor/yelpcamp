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


mongoose.connect("mongodb://localhost:27017/yelp_camp_v3", {useNewUrlParser: true} ); 	
app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine", "ejs"); 
app.use(express.static(__dirname + "/public")); 
seedDB(); 	

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

//RESTFUL ROUTES
app.get("/", function(req, res) {
	res.render("landing"); 
}); 

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res) { 
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if (err) {
			console.log(err);  
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds}); 
		}	
	}); 
}); 


//CREATE - add new campground to DB
app.post("/campgrounds", function(req, res) {
	//get data from form and add to campground array
	var name = req.body.name; 
	var image = req.body.image; 
	var desc = req.body.description; 
	var newCampground = {name: name, image: image, description: desc}; 
	//Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err); 
		} else {
			//Redirect back to campgrounds
			res.redirect("campgrounds"); 
		}
	}); 
}); 

//NEW - show form to create a new campground
app.get("/campgrounds/new", function(req, res) {
	res.render("campgrounds/new"); 
}); 

//SHOW - shows more info about one campground 
app.get("/campgrounds/:id", function(req, res) {
	//find campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if (err) {
			console.log(err); 
		} else {
			console.log(foundCampground); 
			res.render("campgrounds/show", {campground: foundCampground}); 
		}
	}); 
}); 

// ==================================================================
// COMMENTS ROUTES
// ==================================================================

app.get("/campgrounds/:id/comments/new", function(req, res) {
	//findById campground by id 
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err); 
		} else {
			res.render("comments/new", {campground: campground}); 
		}
	}); 
}); 

app.post("/campgrounds/:id/comments", function(req, res) {
	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err); 
			res.redirect("/campgrounds"); 
		} else {
			//create new comment 
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					console.log(err); 
				} else {
					//associate new comment to the campground 
					campground.comments.push(comment); 
					campground.save(); 
					//redirect to the campground's show page
					res.redirect("/campgrounds/" + campground._id); 
				}
			}); 
		}
	}); 
}); 


// ============
// AUTH ROUTES
// ============

//show register form
app.get("/register", function(req, res) {
	res.render("register"); 
}); 

//handle sign up logic
app.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username}); 
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err); 
			return res.render("register"); 
		}	
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds"); 
		}); 
	}); 
}); 

//show login form
app.get("/login", function(req, res) {
	res.render("login"); 
});

//handling login logic
app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds", 
		failureRedirect: "/login"
	}), function(req, res) {
}); 

app.listen(3000, function() {
	console.log("YelpCamp server has started...");
}); 