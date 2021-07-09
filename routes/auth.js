const router = require("express").Router();
const User = require("../model/User");
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {successHandler,errorHandler } = require('../log/configLogger');
const logger = require('../log/logger');
// Register
router.post("/register", successHandler,errorHandler,async (req, res) => {

  // Validate the data
  const {error} = registerValidation(req.body);

  if(error) return res.status(400).send(error.details[0].message);

  // check if user is already in DB
  const emailExist = await User.findOne({email: req.body.email});  
  if(emailExist) return res.status(400).json({message :'Email already exist'});
    
  // Hashing the passwords  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create new user  
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();

    //log
    logger.info('User created successfully:'+ user._id);

    res.send({user: user._id});
  } catch (err) {

    //log
    logger.error('User registration failed:'+ err);

    res.status(400).send(err);
  }
});

// LOGIN
router.post("/login", successHandler,errorHandler, async (req, res) => {

    // Validate the data
    const {error} = loginValidation(req.body);
  
    if(error) return res.status(400).send(error.details[0].message);
  
    // check if user is already in DB
    const user = await User.findOne({email: req.body.email});  
    if(!user) return res.status(400).json({message: 'Email or password is wrong'});
    
    // Password is right
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).json({message:'Email or password is wrong'});
    

    //log
    logger.info('User logged in with UserId:'+ user._id);

    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).json({accessToken: token, userEmail: user.email,userName: user.name});
  });

module.exports = router;
