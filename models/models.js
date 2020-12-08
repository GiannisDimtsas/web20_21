const mongoose = require("mongoose");

const user = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    displayName: {
        type: String
    },
    type: {
        type: String,
        enum: ['USER','ADMIN'],
        required:true
    },
    lastUpload: {
        type: Date,
    },
    records:{
        type: String
    }
});

module.exports = User = mongoose.model("user", user);
