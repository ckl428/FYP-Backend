const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:6,
        max:255
    },
    deptName:{
        type:String,
        required:true,
        min:6,
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
        type:String,
        required:true,
        min:2,
        max:255
    },
    departureTime:{
        type:String,
        required:true,
        min:2,
        max:255
    },
    arrivalTime:{
        type:String,
        required:true,
        min:2,
        max:255
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

module.exports = mongoose.model('Ticket',ticketSchema);
