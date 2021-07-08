const mongoose = require('mongoose');

const Connect = async () => {
    try{
        // mongodb clund connection
        const con = await mongoose.connect("mongodb+srv://sakshi:sakshi@mongo@cluster0.kfrbk.mongodb.net/eksupport?retryWrites=true&w=majority" , {
            useNewUrlParser : true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex : true
        })

        console.log(`MongoDB Connected : ${con.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = Connect 