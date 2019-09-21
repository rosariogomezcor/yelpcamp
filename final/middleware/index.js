var Campground = require("../models/campground"); 
var Comment = require("../models/comment"); 

//all the middleware goes here
var middlewareObj = {}; 

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
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
	} else {
		res.redirect("back"); //this will redirect the user to the previous page they were on 
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {		
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect("back"); //this will redirect the user to the page they were previously on
			} else {
				//does user own the comment? 
				if (foundComment.author.id.equals(req.user._id)) { //method by mongo, bescause comparing won't work
					next();  
				} else {
					res.redirect("back"); 
				}				
			}
		});		
	} else {
		res.redirect("back"); //this will redirect the user to the previous page they were on 
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next(); 
	} 
	res.redirect("/login"); 
}

module.exports = middlewareObj; 