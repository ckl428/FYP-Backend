const router = require('express').Router();
const User = require("../model/User")
const Ticket = require("../model/Ticket")
const Order = require('../model/Order');
const Bookmark = require("../model/Bookmark")
const {ticketValidation}=require("../validation");
var mongodb = require('mongodb');

//Fetch ticket
router.get('/getTicket',async (req,res)=>{
    //Checking if the user is already in the database
    const ticket = await Ticket.find({});
    if(!ticket)
    return res.status(400).send('Currently no ticket');
    console.log('ticket',ticket)
    res.json(ticket);
});

//Fetch single user
router.get('/getUser/:userID',async (req,res)=>{
    console.log('req user id',req.params['userID'])
    //Checking if the user is already in the database
    const user = await User.findOne({_id:req.params['userID']});
    console.log('User found',user)
    if(!user)
    return res.status(400).send('Currently no user');
    res.json(user);
});





router.get('/getAllOrder/',async (req,res)=>{
    //Checking if the user is already in the database
    const order = await Order.find({});
    console.log('order found',order)
    if(!order)
    return res.status(400).send('Currently no order');
    res.json(order);
});

router.get('/getGuestOrder/:passport',async (req,res)=>{
    console.log('req passport',req.params['passport'])
    //Checking if the user is already in the database
    const order = await Order.find({passport:req.params['passport']});
    console.log('order found',order)
    if(order==null)
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
       deptName:req.body.deptName,
       name:req.body.name,
       price:req.body.price,
       start:req.body.start,
       dest:req.body.dest,
       departureTime:req.body.departureTime,
       arrivalTime:req.body.arrivalTime,
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
    console.log('Frontend data', [req.body._id,req.body.user,req.body.userId, req.body.passport])
    //const ticket = await Ticket.deleteOne({_id:new mongodb.ObjectId(req.body._id)})
    const ticket = await Ticket.find({_id:new mongodb.ObjectId(req.body._id)});
    
    console.log('Ticket',ticket)
    if(!ticket)
    return res.status(400).send('Currently no ticket');
    //userID,userName,name,price,start,dest,duration,

    if(req.body.quota-1<0)
    return res.status(400).send('Not enough quota');
    
    const order = new Order({
        userID:req.body.userId,
        ticketID:req.body._id,
        userName:req.body.user,
        deptName:req.body.deptName,
        name:req.body.name,
        customerName:req.body.customerName,
        passport:req.body.passport,
        departureTime:req.body.departureTime,
        arrivalTime:req.body.arrivalTime,
        departureDate:req.body.departureDate,
        backDepartureDate:req.body.backDepartureDate,
        price:req.body.price,
        total:req.body.total,
        start:req.body.start,
        dest:req.body.dest,
        duration:req.body.duration,
        company:req.body.company,
        meal:req.body.meal,
        airClass:req.body.airClass,
        gender:req.body.gender,
        
    });
        const updateTicket = await Ticket.updateOne({_id: new mongodb.ObjectId(req.body._id)},
        {$set:{"quota":req.body.quota - 1}});
        
    try {
        //save user to database
        
        const savedOrder = await order.save();
        
        //send back user data to frontend
        res.send('Add Order Success');
    } catch (err) {
        res.status(400).send(err);
    }
 });

router.post('/deleteOrder',async (req,res)=>{
    console.log('Delete here break', req.body._id)
    const order = await Order.deleteOne({_id:new mongodb.ObjectId(req.body._id)})
    console.log('find order!',req.body._id)
    if(!order)
    return res.status(400).send('Currently no order');
    
    console.log('hello world')
    res.send('Delete success');
});

//Update Ticket
router.post('/updateTicket',async (req,res)=>{
    //VALIDATE DATA
    
    const ticket = await Ticket.find({_id:new mongodb.ObjectId(req.body._id)})
    console.log('Ticket',ticket)
    if(!ticket)
    return res.status(400).send('Currently no ticket');
    //userID,userName,name,price,start,dest,duration,
  
        const updateTicket = await Ticket.updateOne({_id: new mongodb.ObjectId(req.body._id)},
        {$set:{
            "_id":req.body._id,
            "deptName":req.body.deptName,
            "name":req.body.name,
            "price":req.body.price,
            "start":req.body.start,
            "dest":req.body.dest,
            "duration":req.body.duration,
            "departureTime":req.body.departureTime,
            "arrivalTime":req.body.arrivalTime,
            "company":req.body.company,
            "quota":req.body.quota,
        }});
        
        
    try {
        //save order to database
        console.log('pass update ')
        
        
        //send back user data to frontend
        res.send('Update Success');
        console.log('Break point')
    } catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
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

//Bookmark ticket
router.post('/bookmark',async (req,res)=>{
    console.log('Bookmark user', req.body.userId)
    console.log('Bookmark ticket', req.body._id)
    const user = await User.findOne({_id:new mongodb.ObjectId(req.body.userId)})
    console.log('find user!',user)
    if(!user)
    return res.status(400).send('Currently no user');
    

    const bookmark = new Bookmark({
        userID:req.body.userId,
        ticketID:req.body._id,
        deptName:req.body.deptName,
        name:req.body.name,
        price:req.body.price,
        start:req.body.start,
        dest:req.body.dest,
        departureTime:req.body.departureTime,
        arrivalTime:req.body.arrivalTime,
        duration:req.body.duration,
        company:req.body.company,
        quota:req.body.quota
    });
    try {
        //save user to database
        const savedBookmark = await bookmark.save();
        //send back user data to frontend
        res.send('Add Bookmark Success');
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/getBookmark/:userID',async (req,res)=>{
    console.log('req userID',req.params['userID'])
    //Checking if the user is already in the database
    const bookmark = await Bookmark.find({userID:req.params['userID']});
    console.log('bookmark found',bookmark)
    if(bookmark==null){
        console.log('No bookmark')
    return res.status(400).send('Currently no bookmark');
    }
    res.json(bookmark);
});
//Fetch single order
router.get('/getOrder/:userID',async (req,res)=>{
    console.log('req user id',req.params['userID'])
    //Checking if the user is already in the database
    const order = await Order.find({userID:req.params['userID']});
    console.log('order found',order)
    if(!order)
    return res.status(400).send('Currently no order');
    res.json(order);
});

//Delete Order
router.post('/deleteOrder',async (req,res)=>{
    console.log('Delete here break', req.body._id)
    const order = await Order.deleteOne({_id:new mongodb.ObjectId(req.body._id)})
    console.log('find order!',req.body._id)
    if(!order)
    return res.status(400).send('Currently no order');
    
    console.log('hello world')
    res.send('Delete success');
});

//Update Order
router.post('/updateOrder',async (req,res)=>{
    //VALIDATE DATA
    console.log('Frontend data', [req.body._id,req.body.user,req.body.userId, req.body.passport])
    //const ticket = await Ticket.deleteOne({_id:new mongodb.ObjectId(req.body._id)})
    const order = await Order.find({_id:new mongodb.ObjectId(req.body._id)});
    
    console.log('Order',order)
    if(!order)
    return res.status(400).send('Currently no ticket');
    //userID,userName,name,price,start,dest,duration,
  
        const updateOrder = await Order.updateOne({_id: new mongodb.ObjectId(req.body._id)},
        {$set:{
            "customerName":req.body.customerName,
            "gender":req.body.gender,
            "passport":req.body.passport,
            "departureDate":req.body.departureDate,
            "airClass":req.body.airClass,
            "meal":req.body.meal,
            "total":req.body.total,
        }});
        
    try {
        //save order to database
        
        const savedOrder = await order.save();
        
        //send back user data to frontend
        res.send('Update Success');
        console.log('Break point')
    } catch (err) {
        res.status(400).send(err);
    }
 });




module.exports = router;