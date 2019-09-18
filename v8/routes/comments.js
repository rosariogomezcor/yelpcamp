var express = require("express"); 
var router = express.Router({mergeParams: true}); //mergeparams: true -to parse :id from routes path
var Campground = require("../models/campground"); 
var Comment = require("../models/comment"); 

//Comments New
router.get("/new", isLoggedIn, function(req, res) {
	//findById campground by id 
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err); 
		} else {
			res.render("comments/new", {campground: campground}); 
		}
	}); 
}); 

//Comments Create
router.post("/", isLoggedIn, function(req, res) {
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
					//add username and id to comment
					comment.author.id = req.user._id; //comment.author.id - how the model is setup in comment.js
					comment.author.username = req.user.username; 
					//save comment 
					comment.save(); 
					campground.comments.push(comment); 
					campground.save(); 
					console.log(comment); 
					//redirect to the campground's show page
					res.redirect("/campgrounds/" + campground._id); 
				}
			}); 
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

module.exports = router; 