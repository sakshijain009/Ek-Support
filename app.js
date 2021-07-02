const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/eksupport",{useNewUrlParser:true,useUnifiedTopology: true});

/*****************SCHEMAS********************/
const volunteerSchema={
	name: String,
	email: String,
	contact: Number,
	city: String,
	state: String,
	reason: String,
	date: Date
  };

  const contactSchema={
	name: String,
	email: String,
	message: String,
	date: Date
  };
  
  const donateSchema={
	name: String,
	email: String,
	contact: Number,
	city: String,
	state: String,
	pincode: String,
	street: String,
	quantity: String,
	delivery: String,
	date: Date
  };

/**************Collections****************/
const volunteer = mongoose.model("volunteer",volunteerSchema);
const donate = mongoose.model("donate",donateSchema);
const contact = mongoose.model("contact",contactSchema);

//get requests
app.get("/",(req,res)=>{
	res.render("home");
});

app.get("/register",(req,res)=>{
	res.render("register");
});

app.get("/donate",(req,res)=>{
	res.render("donate");
});

//post request
app.post("/volunteer",(req,res)=>{
	const today=new Date();
	console.log(req.body);
	const details = new volunteer({
		name: req.body.name,
  		email: req.body.email,
  		contact:req.body.contact,
  		city:req.body.city,
		state:req.body.state,
		reason:req.body.reason,
  		date:today
	});
	console.log(details);
	details.save();
	res.redirect("/");
});

app.post("/donate",(req,res)=>{
	const today=new Date();
	console.log(req.body);
	const details = new donate({
		name: req.body.name,
  		email: req.body.email,
  		contact:req.body.contact,
  		city:req.body.city,
		state:req.body.state,
		pincode: req.body.pincode,
		address: req.body.street,
		quantity: req.body.message,
		delivery: req.body.optradio,
  		date:today
	});
	console.log(details);
	details.save();
	res.redirect("/");
});

app.post("/contact",(req,res)=>{
	const today=new Date();
	console.log(req.body);
	const details = new contact({
		name: req.body.name,
  		email: req.body.email,
		message: req.body.message,
  		date:today
	});
	console.log(details);
	details.save();
	res.redirect("/");
});

//server
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });