const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {User, Objects, Object} = require("../client/src/models/models");
const auth = require("../middleware/auth");
const validateRegister = require("../validator/registerValidator");
const validateLogin = require("../validator/loginValidator");
const { json } = require("body-parser");
const axios = require("axios");

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
  
      const existingUser = await User.findOne({ email: email });
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
    let objects = new Objects(req.body);
    let lastUpload =  Date.now();
    objects = await objects.save();
    
    await User.updateOne({email: req.body.email}, {
      $push: {
        "objects.features": {
            $each: [req.body.features]
        }
      },
      lastUpload: lastUpload
    })  
  });
    
// GET lat and lon from a HAR file
  router.get("/user/visualizations/get-lat-lon", function (req, res) {
    let ip = [];
    let lat = [];
    let lon = [];
      User.aggregate([
        
        {$match: {email: req.body.email}},
        {$unwind: '$objects.features'},
        {$unwind: '$objects.features.entries'},
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
            axios.get(`http://ip-api.com/json/${ip[0]}`)
            .then((response)=>{
              lat[0] = response.data.lat
              lon[0] = response.data.lon
              data = response.data
              console.log(lat,lon)
            }) 
              res.json(data)  
                       
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
  User.find({type: "USER"}).countDocuments().exec((err,res1) =>{
    let count = res1
    res.json(count)
  }) 
});
router.get("/admin/basic-info/get-methods",function(req, res){
  let countGetMethods;
  Object.find({"features.request.method": "GET"}).countDocuments().exec((err,res1) =>{
    countGetMethods = res1
    res.json(countGetMethods)
  })
})

router.get("/admin/basic-info/post-methods",function(req, res){
  let countPostMethods;
  Object.find({"features.request.method": "POST"}).countDocuments().exec((err,res1) =>{
    countPostMethods = res1
    res.json(countPostMethods)
  })
})

router.get("/admin/basic-info/get-status",function(req, res){
  let countStatus;
  Object.aggregate([
    {$unwind: "$features"},
    {
      $group: {
        _id: "$features.response.status",
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

router.get("/admin/basic-info/domains", function(req, res){
  Object.distinct("features.request.url").countDocuments().exec((err,res1) => {
    if (err) {
      res.send(err);
      res.status(400);
    }else {
      res.json(res1);
    }
  })
})

router.get("/admin/response-time-analyzation/", function(req,res){
  Object.aggregate([
    {$unwind:"$features"},
    {$unwind:"$features.timings"},
    {
      $project:{
        _id:0,
        wait:"$features.timings.wait"  
      }
    }
  ]).exec((err,res1) => {
    if (err) {
      res.send(err);
      res.status(400);
    }else{
      for(i=0; i<res1.length; i++){
        wait = res1[i].wait
      }
      res.json(wait)
    }
  })
})


module.exports = router;
