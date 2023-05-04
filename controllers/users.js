const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    // We will be using try and catch to give us feedback anytime that something happens that will make the service fail
    try{
        // Here I am creating a new user by using the User model and applying the method .create() from mongoose and storing it in a variable
        const newUser = await User.create(req.body);
        // Now this payload I am declaring will create a small package that will become part of my JWT ENCODED TOKEN along with my SECRET and my HEADER
        // https://jwt.io/
        const payload = {
            _id:newUser._id,
            username: newUser.username,
            email: newUser.email,
        }
        
        // The user token will take my payload and my secret to sign in
        const userToken = jwt.sign(payload, JWT_SECRET);
        
        // When we create a cookie we can give it options
        const options = { httpOnly:true, expires: new Date(Date.now() + 9000000)}
        console.log("JWT TOKEN", userToken);
        res.status(201).cookie('userToken', userToken, options).json({user: payload})
    }catch(err){
        res.status(500).json({message: error.message, errors: error.errors})
    }
};

const login = async (req, res) => {
    const userDocument = await User.findOne({email: req.body.email})
    console.log("User", userDocument.password, req.body.password);
    if(!userDocument){
        res.status(400).json({message:'invalid login attempt'})
    }else{
        try{
            const isPasswordValid = await bcrypt.compare(req.body.password, userDocument)
            if(!isPasswordValid) {
                res.status(400).json({ message: 'Invalid Login Attempt'});
            }else{
                const payload = {
                    _id:userDocument._id,
                    username: userDocument.username,
                    email: userDocument.email,
                }
                const userToken = jwt.sign(payload, JWT_SECRET);
                const options = { httpOnly:true, expires: new Date(Date.now() + 9000000)}
                console.log("JWT TOKEN", userToken);
                res.cookie('userToken', userToken, options).json({user: payload})
            }
        }catch(err){
            res.status(500).json({message: error.message, errors: error.errors})
        }
    }
};

const logout = async (req, res) => {
    res.clearCookie('userToken');
    res.json({message: 'You have Successfullu Logged Out!'});
};

const getLoggedInUser = async (req, res) => {
    try{
        const currentUser = await User.findOne({_id: req.user._id}).select('-password');
        res.json(currentUser);
    }catch(err){
        res.status(404).json({ message: error.message })
    }
};

module.exports = {
    register,
    login,
    logout,
    getLoggedInUser,
}