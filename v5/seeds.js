var mongoose = require("mongoose"); 
var Campground = require("./models/campground"); 
var Comment = require("./models/comment"); 

var data = [
		{
			name: "Cloud's Rest", 
			image: "https://images.unsplash.com/photo-1567016515344-5e3b0d67bb75", 
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
		}, 
		{
			name: "Desert Mesa", 
			image: "https://images.unsplash.com/photo-1567018823138-6380fc976b0c", 
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
		},		
		{
			name: "Canyon Floor", 
			image: "https://images.unsplash.com/photo-1567016546367-c27a0d56712e", 
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
		}
	]; 

function seedDB() {
	//Remove all campgrounds
	Campground.remove({}, function(err) {
		if (err) {
			console.log(err); 
		} 
		console.log("removed campgrounds!"); 
		//Add a few campgrounds 
		data.forEach(function(seed) {
			Campground.create(seed, function(err, campground) {
				if (err) {
					console.log(err); 
				} else {
					console.log("added a campground"); 
					//Create a comment 
					Comment.create(
						{
							text: "This place is great, but I wish there was internet", 
							author: "Homer"
						}, function(err, comment) {
							if (err) {
								console.log(err); 
							} else {
								campground.comments.push(comment); 
								campground.save(); 	
								console.log("Created new comment"); 
							}
						});
				}
			}); 
		}); 
	}); 
}


module.exports = seedDB; 