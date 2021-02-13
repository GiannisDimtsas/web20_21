const mongoose = require("mongoose");
const {Schema} = require("mongoose");

//Object model

const Timings = new Schema({
    wait:{type:Number}
});

const Entries = new Schema({
    startedDateTime:{type:Date},
    timings:{type:Timings},
    serverIPAddress: {type: String}
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

const Object = new Schema({
    entries:[Entries],
    timings: {type:Timings},
    request:{type: Request},
    response:{type: Response},
    //headers:{type:Headers}
})

const Objects = new Schema({
    type: {
        type: String,
        enum:['ObjectFeatures']
    },
    features: {
        type: [Object]
    }
})
//---------------------------------------------------------------------------------

//User model
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
    objects: Objects
});

//Connects models with the MongoDB

let user = mongoose.model('User', User);
let entries = mongoose.model('Entries',Entries);
let timings = mongoose.model('Timings', Timings);
let request = mongoose.model('Request', Request);
let response = mongoose.model('Response', Response);
let object = mongoose.model('Object',Object);
let objects = mongoose.model('Objects',Objects);


module.exports = {
    User: user,
    Entries: entries,
    Timings: timings,
    Request: request,
    Response: response,
    Object: object,
    Objects: objects
};