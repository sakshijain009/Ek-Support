const {promisify} = require('util');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({path:'../.env'});



exports.isLoggedIn = async(req,res,next)=>{  //Middleware
	
	console.log(req.cookies);

	if (req.cookies.jwt) {
		try{
			//Verify the token
			console.log(jwt);
			const decoded =  await promisify(jwt.verify)(
				req.cookies.jwt,
				process.env.JWT_SECRET
			);

			console.log(decoded);

			//Check if the user still exists
            if(decoded.id === process.env.SECRET_ID){
                req.user = process.env.SECRET_KEY;
                return next();
            }else{
                console.log("please login");
                return next();
            }
		}catch(error){
			console.log(error);
			return next();
		}
	}else{
		next();
	}
	
}




exports.logout = async(req,res)=>{
	res.cookie('jwt','logout',{
		expires: new Date(Date.now() + 2*1000),
		httpOnly: true
	});

	res.status(200).redirect("/");
}