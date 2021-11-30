const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:6,
        max:255
    },
    price:{
        type:Number
    },
});

module.exports = mongoose.model('Ticket',ticketSchema);
