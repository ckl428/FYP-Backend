const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require("./model/User");
const Ticket = require("./model/Ticket");
//const defaultData = require('./defaultUser')
const bcrypt = require("bcryptjs");
//start, dest, duration, company
const defaultData= 
[{name:'Japan',price:200,start:'HKG',dest:'KIX',departureTime:'15:20',arrivalTime:'18:40',duration:'3 Hours',company:'ABC company',quota:5,image:'https://rimage.gnst.jp/livejapan.com/public/article/detail/a/20/00/a2000231/img/basic/a2000231_main.jpg?20200826191605&q=80&rw=750&rh=536'},
{name:'Japan',price:400,start:'HKG',dest:'NRT',departureTime:'13:15',arrivalTime:'17:15',duration:'4 Hours',company:'Japan company',quota:1,image:'https://rimage.gnst.jp/livejapan.com/public/article/detail/a/00/03/a0003300/img/basic/a0003300_main.jpg?20200806164321&q=80&rw=750&rh=536'},
{name:'South Korea',price:600,start:'HKG',dest:'ICN',departureTime:'09:30',arrivalTime:'12:30',duration:'3 Hours',company:'First Choice company',quota:3,image:'https://media-cms.louvrehotels.com/static/styles/default/public/visuelgoldentulip/incheon-activite-hotels-golden-tulip.jpg'},
{name:'Dubai',price:800,start:'HKG',dest:'DXB',departureTime:'10:30',arrivalTime:'17:20',duration:'7 Hours',company:'Lucky company',quota:0,image:'http://cdn.cnn.com/cnnnext/dam/assets/200924183413-dubai-9-1.jpg'},
{name:'China',price:1000,start:'HKG',dest:'PEK',departureTime:'19:15',arrivalTime:'22:15',duration:'3 Hours',company:'China flight company',quota:2,image:'https://www.visa.com.hk/dam/VCOM/regional/ap/Marquees/marquee-destinations-beijing-1600x900.jpg'},]
//Load Default ticket
const loadTicket = async () => {
        try{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123456',salt);
            console.log('Conncet!',defaultData)
            //clear data first
            await User.deleteMany();
            
            const adminUser = new User({ 
                name:'Admin',
                email:'admin@gmail.com',
                password:hashedPassword,
                role:'admin'
            });

            const memberUser = new User({ 
                name:'Member',
                email:'member@gmail.com',
                password:hashedPassword,
                role:'member'
            });
            await Ticket.deleteMany();
          
            Ticket.insertMany(defaultData)
            
            await adminUser.save()
            await memberUser.save()
           
        }
        finally{
            await Order.deleteMany();
            console.log('Default data loaded!')
            
        }
}
loadTicket();

//Import Routes
const authRoute = require('./routes/auth');
const ticketRoute = require('./routes/ticket');
const Order = require('./model/Order');

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
