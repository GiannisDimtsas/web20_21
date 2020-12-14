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

const Timings = new Schema({
    wait:{type:Number}
});

const Entries = new Schema({
    startedDateTime:{type:Date},
    timings:{type:Timings},
    serverIPAddress:{type:String}
});

const Request = new Schema({
    method:{type:String, enum:['GET', 'POST', 'PUT', 'PATCH', 'DELETE']},
    url:{type:String},
    //headers:{type:Headers}
});

const Response = new Schema({
    status:{type:Number},
    statusText:{type:String},
    //headers:{type:Headers}
});

/*const Headers = new Schema({
    content-type:,
    cache-control:,
    pragma:,
    expires:,
    age:,
    last-modified:,
    host:
});*/

let user = mongoose.model('User', User);
let request = mongoose.model('Request', Request);
let response = mongoose.model('Response', Response);


module.exports = {
    User: user,
    Request: request,
    Response: response
};