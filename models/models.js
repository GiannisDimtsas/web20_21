const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const User = new Schema({
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
        type: Number
    }
});

module.exports = {User: User};
