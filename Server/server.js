const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const auth = require('./auth');

const { Int32 } = require('bson');
const cors = require('cors');

const app = express()
app.use(express.json())

require('dotenv').config();

var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.a7rq8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => {
        console.log("DB Integrated");
    })
    .catch((error) => {
        console.log(error);
    })

  const forma = new mongoose.Schema({
    _id: String,
    pass: String,
    who:Boolean
},
    { timestamps: true }

);

const datain = mongoose.model('datain', forma);

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

const users = []

var email ;
var pkey ;
var check;

// app.get('/users', (req, res) => {
//   res.json(users)
// })

app.post('/users', async (req, res) => {
  try {
    email = req.body.email;
    pkey = req.body.password;
    check =req.body.check;
    console.log (pkey , email ,check );

    try{
      const user=await datain.find({_id: email});
      if(user.length===0){
        const newUser= datain.create({
          _id: email,
          pass: pkey,
          who: check
        });    
          // res.json({status:200});
      }
      else{
        res.status(403).send('Not Allowed');
      }
  }
  catch(error){
      // throw new Error(error);
      console.log(error);
  }    
   // const hashedPassword = await bcrypt.hash(req.body.password, 10)
   // const user = { email: req.body.email, password: hashedPassword }
    // users.push(user)
    // console.log(users);
    // console.log(users.password)
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

app.post('/users/login', async (req, res) => {
  const user = await datain.findOne({_id: req.body.email});
  // console.log(user);
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if( req.body.password == user.pass) {
      const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY);
      res.status(200).json({token: token});
    } else {
      res.status(401).send('invalid password')
    }
  } catch {
    res.status(500).send("invalid email")
  }
})

app.listen(8080) 