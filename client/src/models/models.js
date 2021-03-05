const mongoose = require("mongoose");
const {Schema} = require("mongoose");

//Object model
const Headers = new Schema({
    contentType:{
        name: {type:String, enum:['Content-Type','content-type']},
        value:{type:String}
    },
    cacheControl:{
        name: {type:String, enum:['Cache-Control','cache-control']},
        value:{type:String}
    },
    pragma:{
        name: {type:String, enum:['Pragma','pragma']},
        value:{type:String}
    },
    expires:{
        name: {type:String, enum:['Expires','expires']},
        value:{type:Date}
    },
    lastModified:{
        name: {type:String, enum:['Last-Modified','last-modified']},
        value:{type:Date}
    },
    host:{
        name: {type:String, enum:['Host']},
        value:{type:String}
    },
});

const Entries = new Schema({
    request:{
        method:{
            type:String, 
            enum:['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
        },
        url:{
            type:String
        },
        headers:[Headers]
    },
    response:{
        status:{
            type:Number
        },
        statusText:{
            type:String
        },
        headers:[Headers]
    },
    serverIPAddress:{
        type: String
    },
    startedDateTime:{
        type: Date
    },
    timings:{
        wait:{
            type:Number
        }
    }
    
});
const Object = new Schema({
    type:{
        type:String,
        enum:['Feature']
    },
    entries: [Entries]
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
    objects: [Objects]
});

//Connects models with the MongoDB

let user = mongoose.model('User', User);
let entries = mongoose.model('Entries',Entries);
let object = mongoose.model('Object',Object);
let objects = mongoose.model('Objects',Objects);


module.exports = {
    User: user,
    Entries: entries,
    Object: object,
    Objects: objects
};