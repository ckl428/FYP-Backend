const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require("./model/User");
const Ticket = require("./model/Ticket");
//const defaultData = require('./defaultUser')
const bcrypt = require("bcryptjs");



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



//Paypal part
var paypal = require('paypal-rest-sdk');
var bodyParser = require("body-parser");
var engines = require("consolidate");

app.engine("ejs",engines.ejs);
app.set("views","./views");
app.set("view engine","ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'Actyin7lxR8g06P9th0ZctcuNksGTSldcgUERWh21ANqiqkNO6Os2j39VSgreCvwpdZG4vVQR95yXzNv',
    'client_secret': 'EBIeKy-cMNMibXeE8Y41Ij0_DIN1HBs6YNIu8JdAGd3wVthl-AW5pIbcDSeikNFqhM4922iireW7TUZ1'
});


app.get("/",(req,res)=>{
   res.render("index")
   //res.send('hihsi')
});

var total = 0;
app.post('/paypal',(req,res)=>{
    var ticketPrice = req.body.ticketPrice
    var mealPrice = req.body.mealPrice
    var memberPrice = req.body.memberPrice
    total = parseFloat(ticketPrice)+parseFloat(mealPrice)-parseFloat(memberPrice);
    
    console.log('Item body price', ticketPrice)
    console.log('Meal price', mealPrice)
    console.log('Member price',memberPrice)
    console.log('total', total)
    
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://192.168.0.105:3000/success",
            "cancel_url": "http://192.168.0.105:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [
                    {
                        "name": "Air Ticket",
                        "price": ticketPrice,
                        "currency": "USD",
                        "quantity": 1
                    },
                    {
                        "name": "Meal",
                        "price": mealPrice,
                        "currency": "USD",
                        "quantity": 1
                    },
                    {
                        "name": "Member discount",
                        "price": -memberPrice,
                        "currency": "USD",
                        "quantity": 1
                    },
            ]
            },
            "amount": {
                "currency": "USD",
                "total": total
            },
            "description": "This is the payment description."
        }]
    };
    
    
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            res.redirect(payment.links[1].href);
        }
    });

    
})

app.get('/success',(req,res) => {
   console.log('global total',total)
   

   var payerID = req.query.PayerID;
   var paymentId = req.query.paymentId;
   console.log('total',total)
   var execute_payment_json = {
    "payer_id": payerID,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": total
        }
    }]
};



paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log("Get Payment Response");
        console.log(JSON.stringify(payment));
        res.render('success')
    }
});
   
})

app.get('/cancel',(req,res)=>{
    res.render('cancel')
})
