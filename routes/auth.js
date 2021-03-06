const router = require('express').Router();
const User = require("../model/User");
const Ticket = require("../model/Ticket")
const jwt = require('jsonwebtoken')
const {registerValidation,loginValidation}=require("../validation");
const bcrypt = require("bcryptjs");

//Register Account
router.post('/register',async (req,res) =>{
    //VALIDATE DATA
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in the database
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist)
    return res.status(400).send('Email already exists');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    //Create a new user
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword,
        role:req.body.role,
    });
    try {
        //save user to database
        const savedUser = await user.save();
        //send back user data to frontend
        res.send('Register success');
    } catch (err) {
        res.status(400).send(err);
    }
    
});
//LOGIN
router.post('/login',async (req,res)=>{
    const {error} =loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in the database
    const user = await User.findOne({email:req.body.email});
    if(!user)
    return res.status(400).send('No such user');
    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send('Invalid password')
    
    //Create and assign a token
    const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET);
    
    res.status(200).header('auth-token',token).send(user);

});

//Fetch user
router.get('/getUser',async (req,res)=>{
    //Checking if the user is already in the database
    const user = await User.find({
        role:'member'
    });
    if(!user)
    return res.status(400).send('Currently no user');
    console.log('user',user)
    res.send(user);
});



module.exports = router;