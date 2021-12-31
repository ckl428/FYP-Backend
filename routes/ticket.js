const router = require('express').Router();
const Ticket = require("../model/Ticket")
const {ticketValidation}=require("../validation");

//Fetch ticket
router.get('/getTicket',async (req,res)=>{
    //Checking if the user is already in the database
    const ticket = await Ticket.find({});
    if(!ticket)
    return res.status(400).send('Currently no ticket');
    console.log('ticket',ticket)
    res.json(ticket);
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
//Delete Ticket
/*
router.delete('/deleteTicket',async (req,res)=>{
    
    const ticket = await Ticket.findOne({_id:req.body._id});
    if(!ticket)
    return res.status(400).send('Currently no ticket');
    
    console.log('hello world')
    
    res.send('Delete success');
});
*/



module.exports = router;