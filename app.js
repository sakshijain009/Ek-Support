const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const fs = require('fs');
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

dotenv.config({ path: './.env' });
const app = express();

const authController = require('./controllers/auth');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());

//mongodb connection
require('./server/database/database')();
const volunteer = require('./server/model/volunteer');
const donate = require('./server/model/donate');
const contact = require('./server/model/contact');
const upload = require('./server/model/upload');
const store = require('./server/middleware/multer')

/*****************SCHEMAS********************/
/*const volunteerSchema={
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
  };*/

/**************Collections****************/
/*const volunteer = mongoose.model("volunteer",volunteerSchema);
const donate = mongoose.model("donate",donateSchema);
const contact = mongoose.model("contact",contactSchema);*/

//get requests
app.get("/",async (req,res)=>{
	const item = await upload.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
    });
	console.log(item);
	res.render('home', { items: item });
});

app.get("/upload",authController.isLoggedIn, async (req,res)=>{
	if(req.user){
		const item = await upload.find({}, (err, items) => {
			if (err) {
				console.log(err);
				res.status(500).send('An error occurred', err);
			}
		});
		console.log(item);
		res.render('upload', { items: item });
	}else{
		res.redirect("/login");
	}
});

app.get("/register",(req,res)=>{
	res.render("register");
});

app.get("/donate",(req,res)=>{
	res.render("donate");
});

app.get("/login",(req,res)=>{
	res.render("login",{display:'none'});
});

//post request
app.post('/login', async (req, res) => {

	try {
	  console.log(req.body);
	  const logid = req.body.logid;
	  const pwd = req.body.pwd;
	  let hashedPassword = await bcrypt.hash(process.env.SECRET_KEY, 8);
	  if(logid==='12345' && (await bcrypt.compare(pwd, hashedPassword))) {
  
		  const id = logid;
		  console.log("id :" + id);
		  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN
		  });
  
		  const cookieOptions = {
			expires: new Date(
			  Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
			),
			httpOnly: true
		  };
		  res.cookie('jwt', token, cookieOptions);
		  console.log(jwt);
		  res.status(200).redirect("/upload");
	  }else{
		  res.render('login',{display:'block'});
	  }
	} catch (error) {
	  console.log(error);
	}
  });


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

app.post("/upload",store.fields([
	{
		name: 'file1', maxCount: 1
  	}, 
  	{
		name: 'file2', maxCount: 1
  	},
	{
		name: 'file3', maxCount: 1
  	},
	{
		name: 'file4', maxCount: 1
  	}
	]),(req,res,next)=>{
		const files = req.files;
		console.log(req.files);

		if(!files){
			const error = new Error('Please choose files');
			error.httpStatusCode = 400;
			return next(error)
		}

		let finalImg = {
			file1:{
				filename : files.file1[0].filename,
			},
			file2:{
				filename : files.file2[0].filename,
			},
			file3:{
				filename : files.file3[0].filename,
			},
			file4:{
				filename : files.file4[0].filename,
			}
		}
		let newUpload = new upload(finalImg);
		newUpload
                .save()
                .then(() => {
                    console.log("success uploading images");
					res.redirect("/#gallery");
                })
                .catch(error =>{
                    if(error){
                        if(error.name === 'MongoError' && error.code === 11000){
                            console.log("File already exists");
                        }
						console.log("error");
						console.log("unable to upload");
						res.redirect("/");
                    }
                })	
});

//LOGOUT request---------------------------------------------------
app.get("/logout", authController.logout);



//server
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });