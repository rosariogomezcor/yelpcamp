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

//COMMENT EDIT ROUTE 
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			res.redirect("back"); 
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment}); 
		}
	}); 
}); 

//COMMENT UPDATE ROUTE
router.put("/:comment_id", checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect("back"); 
		} else {
			res.redirect("/campgrounds/" + req.params.id); 
		}
	});  
}); 

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.redirect("back"); 
		} else {
			res.redirect("/campgrounds/" + req.params.id); 
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

function checkCommentOwnership(req, res, next) {
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

module.exports = router; 