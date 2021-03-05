const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {User, Objects, Object} = require("../client/src/models/models");
const validateRegister = require("../validator/registerValidator");
const validateLogin = require("../validator/loginValidator");
const { json } = require("body-parser");
const axios = require("axios");
const auths = require('../middleware/auths')
//User Routes



//POST register a new user
router.post("/register", async (req, res) => {
    try {
      let { email, password,displayName  } = req.body;
      
      // validate register form
  
      const { errors, isValid } = validateRegister(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }
  
      const existingUser = await User.findOne({ email: email });  //Check if there's already existing user
      if (existingUser)
        return res
          .status(400)
          .json({ msg: "An account with this email already exists." });
  
      if (!displayName) displayName = email;
  
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt); //encrypt password
  
      const newUser = new User({
        displayName,
        password: passwordHash,
        email,
        type: 'USER'
      });

      newUser.objects = {type: 'ObjectFeatures', features: []};
      const savedUser = await newUser.save();
      res.json(savedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
//-----------------------------------------------------------------------------------------------------

//POST login a user
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // validate login form
      const { errors, isValid } = validateLogin(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }
  
      const user = await User.findOne({ email: email });
      if (!user)
        return res
          .status(400)
          .json({ msg: "No account with this email has been registered." });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // create a unique token for the user
      res.json({
        token,
        user: {
          id: user._id,
          displayName: user.displayName,
          type: user.type
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
//--------------------------------------------------------------------------------------

//POST change username 
router.post("/user/profile-management/change-username", async (req, res) =>{
    try {
        let { email, password, displayName } = req.body;
        if (!email || !password)
            return res
                .status(400).json({msg: "Not all fields have been entered"});

        const user = await User.findOne({email: email});
        if (!user)
            return res
                .status(400).json({msg: "No account with this email has been registered"});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
        user.displayName = displayName;
        user.save();
        res.json({
            user:{
                id: user._id,
                displayName: displayName
            }
        })

    } catch(err) {
        res.status(500).json(err);
    }
});
//--------------------------------------------------------------------------------------------

//POST change user password
router.post("/user/profile-management/change-password", async (req, res) =>{
    try {
        let { email, password, newPassword } = req.body;
        if (!email || !password || !newPassword)
            return res
                .status(400).json({msg: "Not all fields have been entered"});

        const user = await User.findOne({email: email});
        if (!user)
            return res
                .status(400).json({msg: "No account with this email has been registered"});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res
                .status(400).json({msg: "Invalid credentials."});  
        
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(req.body.newPassword,salt);
        user.password = passwordHash;
        user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
            user:{
                id: user._id,
                password: user.password
            }
        })

    } catch(err) {
        res.status(500).json(err);
    }
});
//-------------------------------------------------------------------------------------------------------

//POST upload HAR files
  router.post("/user/upload", async (req, res, next) => {
      let objects =  new Objects(req.body);
      
      await objects.save(); //creates a new object and saves it in MongoDB
      let lastUpload =  Date.now(); //Saves when the last upload did happen
       User.updateOne(
        {email: req.body.email}, //Looking for the email-matched user and update it's objects field
        { 
          $push: {
            "objects": {
                $each: [req.body]
            }
        },
        lastUpload: lastUpload
      })       
  });
    
// GET lat and lon from a HAR file
  router.get("/user/visualizations/get-lat-lon", function (req, res) {
    let ip = [];
    var lat = [];
    var lon = [];
      User.aggregate([
        
        {$match: {email: req.body.email}},
        {$unwind: '$objects.features'},           //deconstructs features
        {$unwind: '$objects.features.entries'},   //and entries array in order to get data
        {
          $project: {
            _id: 0,
            "objects.features.entries.serverIPAddress":1
          }
        },
        {
          $project: {
            _id: 0,
            ip:"$objects.features.entries.serverIPAddress"
          }
        }
        ]).exec((err,res1) => {
          if (err) {
            res.send(err);
            res.status(400);
          }else {

            for(i=0; i<res1.length; i++){   
              ip[i] = res1[i].ip
            } 
            let data;
            for(i=0; i<res1.length; i++){
              axios.get(`http://ip-api.com/json/${ip[i]}`) //Sends a get request to ip-api and receives a json response with all 
              .then((response)=>{                          // the information needed about Lat, Lon, city, provider etc.
                lat[i] = response.data.lat
                lon[i] = response.data.lon
                data = response.data
                console.log(lat,lon)
              })
            }
              //res.json(response.data)              
        }
      })  
  })

router.get("/user/profile-management/last-upload",function(req, res) {
  User.aggregate([
    {$match: {email: req.body.email}},
    {
      $project:{
        _id:0,
        lastUpload:"$lastUpload"
      }
    }
  ]).exec((err,res1) =>{
    let lastUpload = res1
    res.json(lastUpload)
  })
})

//Admin routes

//GET get number of users
router.get("/admin/basic-info", function(req, res){
  User.find({type: "USER"}).countDocuments().exec((err,res1) =>{ //Finds all documents which have the "USER" attribute in their type 
    let count = res1                                             // and count them
    res.json(count)
  }) 
});
router.get("/admin/basic-info/get-methods",function(req, res){  // same for "GET" methods
  Object.aggregate([
    {$unwind:'$features'},
    {$unwind:'$features.entries'},
    {
      $group:{
        _id:  
        '$features.entries.request.method',
        count:{$sum:1}
      }
    }
  ]).exec((err,res1) =>{
    if (err) {
      res.send(err);
      res.status(400);
    }else {
      res.json(res1);
    }   
  })
})

router.get("/admin/basic-info/post-methods",function(req, res){ // Same for "POST" methods
Object.aggregate([
  {$unwind:'$features'},
  {$unwind:'$features.entries'},
  {
    $group:{
      _id: '$features.entries.request.method',
      count:{$sum:1}
    }
  }
]).exec((err,res1) =>{
  if (err) {
    res.send(err);
    res.status(400);
  }else {
    res.json(res1);
  }   
})
})

router.get("/admin/basic-info/get-status",function(req, res){ // Finds the different status messages
  Object.aggregate([
    {$unwind: "$features"},
    {$unwind: '$features.entries'},
    {
      $group: {
        _id: "$features.entries.response.status",
        count: {$sum:1}
      }
    }
  ]).exec((err,res1) => {
    if (err) {
      res.send(err);
      res.status(400);
    }else {
      res.json(res1);
    }
  })
})

router.get("/admin/basic-info/domains", function(req, res){ // Finds the unique Domains
  Object.aggregate([
    {$unwind: "$features"},
    {$unwind: '$features.entries'},
    {
      $group: {
        _id: "$features.entries.request.url",
        count: {$sum:1}
      }
    }
  ]).exec((err,res1) => {
    if (err) {
      res.send(err);
      res.status(400);
    }else {
      res.json(res1);
    }
  })
})

router.get("/admin/response-time-analyzation/", function(req,res){ //TODO
  wait = [];
  let wait_mean;
  Object.aggregate([
    {$unwind:"$features"},
    {$unwind:"$features.entries"},
    {
      $project:{
        _id:0,
        wait:"$features.entries.timings.wait"  
      }
    }
  ]).exec((err,res1) => {
    if (err) {
      res.send(err);
      res.status(400);
    }else{
      wait = 0;
      for(i=0; i<res1.length; i++){
        wait = res1[i].wait + wait;
      }
      wait_mean = wait/res1.length
      res.json(wait_mean)
    }
  })
})


module.exports = router;
