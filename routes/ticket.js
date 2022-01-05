const router = require('express').Router();
const { db } = require('../model/Ticket');
const Ticket = require("../model/Ticket")
const {ticketValidation}=require("../validation");
//const  ObjectID = require('mongodb').ObjectId
var mongodb = require('mongodb');
const Order = require('../model/Order');
//Fetch ticket
router.get('/getTicket',async (req,res)=>{
    //Checking if the user is already in the database
    const ticket = await Ticket.find({});
    if(!ticket)
    return res.status(400).send('Currently no ticket');
    console.log('ticket',ticket)
    res.json(ticket);
});

router.get('/getOrder/:userID',async (req,res)=>{
    console.log('req user id',req.params['userID'])
    //Checking if the user is already in the database
    const order = await Order.find({userID:req.params['userID']});
    console.log('order found',order)
    if(!order)
    return res.status(400).send('Currently no order');
    res.json(order);
});


//Add Ticket
router.post('/addTicket',async (req,res)=>{
   //VALIDATE DATA
   const {error} = ticketValidation(req.body);
   if(error) return res.status(400).send(error.details[0].message);

   
   //Create a new user
   const ticket = new Ticket({
       name:req.body.name,
       price:req.body.price,
       start:req.body.start,
       dest:req.body.dest,
       duration:req.body.duration,
       company:req.body.company,
       quota:req.body.quota
   });
   try {
       //save user to database
       const savedTicket = await ticket.save();
       //send back user data to frontend
       res.send('Add Ticket Success');
   } catch (err) {
       res.status(400).send(err);
   }
});
//Order Ticket
//Add Ticket
router.post('/orderTicket',async (req,res)=>{
    //VALIDATE DATA
    console.log('Frontend data', [req.body._id,req.body.user,req.body.userId])
    //const ticket = await Ticket.deleteOne({_id:new mongodb.ObjectId(req.body._id)})
    const ticket = await Ticket.find({_id:new mongodb.ObjectId(req.body._id)});
    console.log('Ticket',ticket)
    if(!ticket)
    return res.status(400).send('Currently no ticket');
    //userID,userName,name,price,start,dest,duration,
    const order = new Order({
        userID:req.body.userId,
        ticketID:req.body._id,
        userName:req.body.user,
        name:req.body.name,
        price:req.body.price,
        start:req.body.start,
        dest:req.body.dest,
        duration:req.body.duration,
        company:req.body.company,
        image:req.body.image,
        quota:req.body.quota
    });
    try {
        //save user to database
        const savedOrder = await order.save();
        //send back user data to frontend
        res.send('Add Order Success');
    } catch (err) {
        res.status(400).send(err);
    }

   
    //res.send('ticket find')
/*
    */
 });

//Delete Ticket
router.post('/deleteTicket',async (req,res)=>{
    
    const ticket = await Ticket.deleteOne({_id:new mongodb.ObjectId(req.body._id)})
    console.log('find ticket!',req.body._id)
    if(!ticket)
    return res.status(400).send('Currently no ticket');
    
    console.log('hello world')
    res.send('Delete success');
});




module.exports = router;