var mongoose = require("mongoose"); 
var Campground = require("./models/campground"); 
var Comment = require("./models/comment"); 

var data = [
		{
			name: "Cloud's Rest", 
			image: "https://images.unsplash.com/photo-1567016515344-5e3b0d67bb75", 
			description: "blah blah blah"
		}, 
		{
			name: "Desert Mesa", 
			image: "https://images.unsplash.com/photo-1567018823138-6380fc976b0c", 
			description: "blah blah blah"
		},		
		{
			name: "Canyon Floor", 
			image: "https://images.unsplash.com/photo-1567016546367-c27a0d56712e", 
			description: "blah blah blah"
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