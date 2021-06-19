const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

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


//server
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });