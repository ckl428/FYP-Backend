const mongoose = require('mongoose');
const Order = require('./Order');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:6,
        max:255
    },
    email:{
        type:String,
        required:true,
        max:255,
        min:6
    },
    password:{
        type:String,
        required:true,
        max:1024,
        min:6
    },
    role:{
        type:String,
        required:true,
        max:1024,
        min:6
    },
    bookmark:[{
        type:String,
    }]


   
});

module.exports = mongoose.model('User',userSchema);
