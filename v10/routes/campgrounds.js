var express = require("express"); 
var router = express.Router(); 
var Campground = require("../models/campground"); 

//INDEX - show all campgrounds
router.get("/", function(req, res) { 
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
router.post("/", isLoggedIn, function(req, res) {
	//get data from form and add to campground array
	var name = req.body.name; 
	var image = req.body.image; 
	var desc = req.body.description; 
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: desc, author: author}; 
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
router.get("/new", isLoggedIn, function(req, res) {
	res.render("campgrounds/new"); 
}); 

//SHOW - shows more info about one campground 
router.get("/:id", function(req, res) {
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

//EDIT CAMPGROUND ROUTE 
router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		res.render("campgrounds/edit", {campground: foundCampground}); 
	});				
});		 

//UPDATE CAMPGROUND ROUTE 
router.put("/:id", checkCampgroundOwnership, function(req, res) {
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if (err) {
			res.redirect("/campgrounds"); 
		} else {
			//redirect somewhere (show page)
			res.redirect("/campgrounds/" + req.params.id); 
		}
	}); 
}); 

//DESTROY CAMPGROUND ROUTE 
router.delete("/:id", checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect("/campgrounds"); 
		} else {
			res.redirect("/campgrounds"); 
		}
	}); 
}); 

//middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next(); 
	} 
	res.redirect("/login"); 
}

function checkCampgroundOwnership(req, res, next) {
	if (req.isAuthenticated()) {		
		Campground.findById(req.params.id, function(err, foundCampground) {
			if (err) {
				res.redirect("back"); //this will redirect the user to the page they were previously on
			} else {
				//does user own the campground? 
				if (foundCampground.author.id.equals(req.user._id)) { //method by mongo, bescause comparing won't work
					next();  
				} else {
					res.redirect("back"); 
				}				
			}
		});		
			//if yes, allow campground editing
			//if not, redirect
	} else {
		res.redirect("back"); //this will redirect the user to the previous page they were on 
	}
	//if not, redirect
}

module.exports = router;