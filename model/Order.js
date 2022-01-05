const mongoose = require('mongoose');
const Ticket = require('./Ticket');

const orderSchema = new mongoose.Schema({
    //orderID, auto gen
    userID:{
        type:String,
        required:true,
        min:1,
        max:255
    },
    ticketID:{
        type:String,
        required:true,
        min:1,
        max:255
    },
    userName:{
        type:String,
        required:true,
        min:1,
        max:255
    },
    name:{
        type:String,
        required:true,
        min:1,
        max:255
    },
    price:{
        type:Number
    },
    start:{
        type:String,
        required:true,
        min:2,
        max:255
    },
    dest:{
        type:String,
        required:true,
        min:2,
        max:255
    },
    duration:{
        type:Number
    },
    company:{
        type:String,
        required:true,
        min:2,
        max:255
    },
    image:{
        type:String,
        min:1,
        max:255
    },
    quota:{
        type:Number
    },
    
});

module.exports = mongoose.model('Order',orderSchema);
