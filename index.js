const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require("./model/User");
const Ticket = require("./model/Ticket");
//const defaultData = require('./defaultUser')

//start, dest, duration, company
const defaultData= 
[{name:'Japan',price:200,start:'HKG',dest:'KIX',duration:3,company:'ABC company',quota:5,image:'https://rimage.gnst.jp/livejapan.com/public/article/detail/a/20/00/a2000231/img/basic/a2000231_main.jpg?20200826191605&q=80&rw=750&rh=536'},
{name:'Japan',price:400,start:'HKG',dest:'NRT',duration:4,company:'Japan company',quota:1,image:'https://rimage.gnst.jp/livejapan.com/public/article/detail/a/00/03/a0003300/img/basic/a0003300_main.jpg?20200806164321&q=80&rw=750&rh=536'},
{name:'South Korea',price:600,start:'HKG',dest:'ICN',duration:3,company:'First Choice company',quota:3,image:'https://media-cms.louvrehotels.com/static/styles/default/public/visuelgoldentulip/incheon-activite-hotels-golden-tulip.jpg'},
{name:'Dubai',price:800,start:'HKG',dest:'DXB',duration:7,company:'Lucky company',quota:0,image:'http://cdn.cnn.com/cnnnext/dam/assets/200924183413-dubai-9-1.jpg'},
{name:'China',price:1000,start:'HKG',dest:'PEK',duration:3,company:'China flight company',quota:2,image:'https://www.visa.com.hk/dam/VCOM/regional/ap/Marquees/marquee-destinations-beijing-1600x900.jpg'},]
//Load Default ticket
const loadTicket = async () => {
        try{   ``
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
