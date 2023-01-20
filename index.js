const express = require('express');
const env = require('dotenv');
const ejs = require('ejs');
const  path = require('path');
const  app = express();
const mongoose = require('mongoose')
require('./app/middleware/db')
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const { register } = require('./app/controller/user_controller');

app.use(express.static('app/uploads'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(cookieParser());
const route = require('./app/routes/route')
app.use('/',route);
// app.use('./app/routes/router/userRouter.js');
// 
// const static_path = path.join(__dirname,"./views")

//join views and  directory
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

// app.get("/",(req,res)=>{
//     res.send("hello world")
// })

app.listen(4800,() => console.log('Listing on port 4800...'));




// app.set('view engine','ejs')
// app.get("/",(req,res)=>{
//      res.render('register.ejs')
// })

//join views and  directory

// app.use(express.static("app/uploads"));
// app.post("/register",async(req,res)=>{
//     const {userData} = req.body;
//    const data = new user_model(userData)
//    console.log(req.body)
//    data.save();
// })