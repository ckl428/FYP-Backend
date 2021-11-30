const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require("./model/User");
const Ticket = require("./model/Ticket");
//const defaultData = require('./defaultUser')

const defaultData= 
[{name:'Ticket1',price:200},
{name:'Ticket2',price:400},
{name:'Ticket3',price:600},
{name:'Ticket4',price:800},
{name:'Ticket5',price:1000},]
//Load Default ticket
const loadTicket = async () => {
        try{
            console.log('Conncet!',defaultData)
            //clear data first
            await User.deleteMany();
            const defaultUser = new User({
                name:'user1',
                email:'default@gmail.com',
                password:'123456'
            });
            await Ticket.deleteMany();
            //const defaultTicket = new Ticket({});
            Ticket.insertMany(defaultData)
            
            await defaultUser.save()
            //await defaultTicket.save()
        }
        finally{
            console.log('Default data loaded!')
            
        }
}
loadTicket();

//Import Routes
const authRoute = require('./routes/auth');
const ticketRoute = require('./routes/ticket');

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser:true},
    () => console.log('connect to db!'));

//Middleware
app.use(express.json());

//Route Middleware
app.use('/api/user',authRoute);
app.use('/api/ticket',ticketRoute)
const PORT = 3000;
app.listen(PORT,()=> console.log('running on port ' + PORT));
