const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {User} = require("../models/models");
const auth = require("../middleware/auth");
const validateRegister = require("../validator/registerValidator");
const validateLogin = require("../validator/loginValidator");
//const adminRouter = require("express").Router();

function authAdmin(req, res, next) {
    if (req.type !== 'ADMIN') {
        res.json('Unauthorized');
        res.status(400);
    }
    next();
}

//User Routes

//POST register user
router.post("/register", async (req, res) => {
    try {
      let { email, password, password2, displayName } = req.body;
  
      // validate
  
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
      const passwordHash = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        email,
        password: passwordHash,
        displayName,
        type: 'USER'
      });
      const savedUser = await newUser.save();
      res.json(savedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
//-----------------------------------------------------------------------------------------------------

//POST login user
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // validate
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
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
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
router.post("/change-username", async (req, res) =>{
    try {
        let { email, password, displayName } = req.body;
        if (!email || !password)
            return res
                .status(400).json({msg: "Not all fields have been entered"});

        const user = await User.findOne({email: email});
        if (!user)
            return res
                .status(400).json({msg: "No account with this email has been registered"});

         
        user.displayName = req.body.displayName;
        user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
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
router.post("/change-password", async (req, res) =>{
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

router.delete("/delete", auth, async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.user);
      res.json(deletedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
//-------------------------------------------------------------------------------------------------------

//POST upload HAR files
    //TODO
//POST last upload
    //TODO
//POST number of records
    //TODO

//=============================================================================================
//Admin Routes


module.exports = router;