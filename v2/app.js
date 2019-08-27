var express = require("express"), 
 	app = express(), 
	bodyParser = require("body-parser"), 
	mongoose = require("mongoose"); 

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true} ); 	
app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine", "ejs"); 

//MONGOOSE SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String, 
	image: String, 
	description: String
}); 

var Campground = new mongoose.model("Campground", campgroundSchema); 

// Campground.create(
// 	{
// 		name: "Granit Hill", 
// 		image: "https://pixabay.com/get/5fe8d1434852b108f5d084609620367d1c3ed9e04e50744f702a78d59748c5_340.jpg", 
// 		description: "This is a huge granite hill, no bathrooms, no water. Beautiful granite"
// 	}, function(err, campground) {
// 		if (err) {
// 			console.log(err); 
// 		} else {
// 			console.log("Newly created campground: ");
// 			console.log(campground);  
// 		}
// 	}); 

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
			res.render("index", {campgrounds: allCampgrounds}); 
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
	res.render("new.ejs"); 
}); 

//SHOW - shows more info about one campground 
app.get("/campgrounds/:id", function(req, res) {
	//find campground with provided ID
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			console.log(err); 
		} else {
			res.render("show", {campground: foundCampground}); 
		}
	}); 
}); 

app.listen(3000, function() {
	console.log("YelpCamp server has started...")
}); 