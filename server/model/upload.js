const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    file1:{
        filename : {
            type : String,
            unique : true,
            required: true
        }
    },
    file2:{
        filename : {
            type : String,
            unique : true,
            required: true
        }
    },
    file3:{
        filename : {
            type : String,
            unique : true,
            required: true
        }
    },
    file4:{
        filename : {
            type : String,
            unique : true,
            required: true
        }
    }
})

module.exports = UploadModel = mongoose.model('upload', uploadSchema);