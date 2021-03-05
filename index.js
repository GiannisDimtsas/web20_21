const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');


//set up express

const app = express();

app.use(express.json({limit:'50mb'}));
app.use(cors());
app.use(express.urlencoded({limit:'50mb', extended:true}));
app.use(cookieParser());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('The server has started on port: ',PORT));

//set up mongoose

mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING, 
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
    },
    (err) => {
        if(err) throw err;
        console.log("Database connection established");
    }
);

//set up  routes
const route = require("./routes/routes");
app.use("/", route);