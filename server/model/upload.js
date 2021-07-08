const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    file1:{
        filename : {
            type : String,
            unique : true,
            required: true
        },
        contentType : {
            type: String,
            required : true
        },
        imageBase64 : {
            type : String,
            required: true
        }
    },
    file2:{
        filename : {
            type : String,
            unique : true,
            required: true
        },
        contentType : {
            type: String,
            required : true
        },
        imageBase64 : {
            type : String,
            required: true
        }
    },
    file3:{
        filename : {
            type : String,
            unique : true,
            required: true
        },
        contentType : {
            type: String,
            required : true
        },
        imageBase64 : {
            type : String,
            required: true
        }
    },
    file4:{
        filename : {
            type : String,
            unique : true,
            required: true
        },
        contentType : {
            type: String,
            required : true
        },
        imageBase64 : {
            type : String,
            required: true
        }
    }
})

module.exports = UploadModel = mongoose.model('upload', uploadSchema);