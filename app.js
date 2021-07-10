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
		res.render('upload', { items: item,status:['none','none','none','none'] ,display:'none'});
	}else{
		res.redirect("/login");
	}
});

app.get("/getin",authController.isLoggedIn,(req,res)=>{
	if(req.user){
		res.redirect("/upload");
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





/**********POST REQUESTS *****************/
app.post('/login', async (req, res) => {

	try {
	  console.log(req.body);
	  const logid = req.body.logid;
	  const pwd = req.body.pwd;
	  let hashedPassword = await bcrypt.hash(process.env.SECRET_KEY, 8);
	  if(logid===process.env.SECRET_ID && (await bcrypt.compare(pwd, hashedPassword))) {
  
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




//Submit volunteer form-----------------------------------
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



//Submit donate form--------------------------------------
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



//Submit contact form--------------------------------------
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



//Preview images------------------------------------
app.post("/preview",async (req,res)=>{
	console.log(req.body);
	const item = await upload.find({}, (err, items) => {
		if (err) {
			console.log(err);
			res.status(500).send('An error occurred', err);
		}
	});

	const partiItem = await upload.find({slideNumber:req.body.preview}, (err, items) => {
		if (err) {
			console.log(err);
			res.status(500).send('An error occurred', err);
		}
	});
	console.log(partiItem);
	res.render("upload", { items: item,status:[partiItem[0].file1.filename,partiItem[0].file2.filename,partiItem[0].file3.filename,partiItem[0].file4.filename],display:'block' });
	
});


//DELETE SLIDE OF GALLERY------------------------------------
app.post("/deleteslide",async (req,res)=>{
	console.log(req.body);
	const item = await upload.findOne({slideNumber: req.body.delete}, (err, items) => {
		if (err) {
			console.log(err);
			res.status(500).send('An error occurred', err);
		}
	});
	console.log(item);
	const filea = 'public/uploads/' + item.file1.filename;
	const fileb = 'public/uploads/' + item.file2.filename;
	const filec = 'public/uploads/' + item.file3.filename;
	const filed = 'public/uploads/' + item.file4.filename;

	fs.unlink(filea, function (err) {
		if (err) throw err;
		console.log('File deleted!');
	});
	fs.unlink(fileb, function (err) {
		if (err) throw err;
		console.log('File deleted!');
	});
	fs.unlink(filec, function (err) {
		if (err) throw err;
		console.log('File deleted!');
	});
	fs.unlink(filed, function (err) {
		if (err) throw err;
		console.log('File deleted!');
	});
	
	await upload.deleteOne({slideNumber: req.body.delete}, (err, items) => {
		if (err) {
			console.log(err);
			res.status(500).send('An error occurred', err);
		}
	});
	
	await upload.updateMany({slideNumber: {$gt : req.body.delete}}, {$inc:{slideNumber:-1}},(err, items) => {
		if (err) {
			console.log(err);
			res.status(500).send('An error occurred', err);
		}
	});

	res.redirect("/upload");
});


//Upload images------------------------------------
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
	]),async (req,res,next)=>{
		const files = req.files;
		console.log(req.files);
		const item = await upload.find({}, (err, items) => {
			if (err) {
				console.log(err);
				res.status(500).send('An error occurred', err);
			}
		});
		const slide = item.length+2;

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
			},
			slideNumber: slide
		}
		let newUpload = new upload(finalImg);
		newUpload
                .save()
                .then(() => {
                    console.log("success uploading images");
					res.redirect("/upload");
                })
                .catch(error =>{
                    if(error){
                        if(error.name === 'MongoError' && error.code === 11000){
                            console.log("File already exists");
                        }
						console.log("error");
						console.log("unable to upload");
						res.redirect("/upload");
                    }
                })	
});

//LOGOUT request---------------------------------------------------
app.get("/logout", authController.logout);



//server
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });