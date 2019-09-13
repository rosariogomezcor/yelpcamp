var express = require("express"); 
var app = express(); 
var bodyParser = require("body-parser"); 

app.use(bodyParser.urlencoded({extended: true})); 

app.set("view engine", "ejs"); 

var campgrounds = [
		{name: "Salmon Creek", image: "https://pixabay.com/get/57e8d1464d53a514f6da8c7dda793f7f1636dfe2564c704c732a7fd0974cc45b_960.jpg"}, 
		{name: "Granit Hill", image: "https://pixabay.com/get/50e9d4474856b108f5d084609620367d1c3ed9e04e50744f702b7fd4964cc6_960.jpg"},  
		{name: "Mountain Goat's Rest", image: "https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c732a7fd0974cc45b_340.jpg"}, 
		{name: "Salmon Creek", image: "https://pixabay.com/get/57e8d1464d53a514f6da8c7dda793f7f1636dfe2564c704c732a7fd0974cc45b_960.jpg"}, 
		{name: "Granit Hill", image: "https://pixabay.com/get/50e9d4474856b108f5d084609620367d1c3ed9e04e50744f702b7fd4964cc6_960.jpg"},  
		{name: "Mountain Goat's Rest", image: "https:///pixabay.com/get/57e8d1464d53a514f6da8c7dda793f7f1636dfe2564c704c732a7fd0974cc45b_960.jpg"}, 
		{name: "Salmon Creek", image: "https://pixabay.com/get/57e8d1464d53a514f6da8c7dda793f7f1636dfe2564c704c732a7fd0974cc45b_960.jpg"}, 
		{name: "Granit Hill", image: "https://pixabay.com/get/50e9d4474856b108f5d084609620367d1c3ed9e04e50744f702b7fd4964cc6_960.jpg"},  
		{name: "Mountain Goat's Rest", image: "https:///pixabay.com/get/57e8d1464d53a514f6da8c7dda793f7f1636dfe2564c704c732a7fd0974cc45b_960.jpg"}
];

app.get("/", function(req, res) {
	res.render("landing"); 
}); 

app.get("/campgrounds", function(req, res) { 
	res.render("campgrounds", {campgrounds: campgrounds}); 
}); 

app.post("/campgrounds", function(req, res) {
	//get data from form and add to campground array
	var name = req.body.name; 
	var image = req.body.image; 
	var newCampground = {name: name, image: image}; 
	campgrounds.push(newCampground); 
	//redirect back to campgrounds page
	res.redirect("campgrounds"); 
}); 

app.get("/campgrounds/new", function(req, res) {
	res.render("new.ejs"); 
}); 

app.listen(3000, function() {
	console.log("YelpCamp server has started...")
}); 
