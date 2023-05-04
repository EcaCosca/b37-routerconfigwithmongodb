require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const User = require('./models/user');
const authRouter = require('./routes/users')
const { query, validationResult } = require('express-validator');
const app = express();
const cors = require('cors')

const port = process.env.PORT || 8000

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter)

// DB Connection
mongoose.connect(process.env.MONGODBURI)

const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// GET /users ⇒ return all users
app.get('/users', (req,res)=>{
    User.find({})
    .then(module=> res.status(200).send(module))
    .catch(err=>res.status(400).send(err))
})

// GET /users/:id ⇒ return a single user
app.get('/users/:id', (req,res)=>{
    User.find({"_id":req.params.id})
    .then(module=> res.status(200).send(module))
    .catch(err=>res.status(404).send(err))
})

// POST /users ⇒ create a new user
app.post('/users', query('firstname').notEmpty(), query('lastname').notEmpty(), (req,res)=>{
    const result = validationResult(req);
    if (result.isEmpty()) {
    //   return res.send(`Hello, ${req.query.firstname}!`);
      res.send({ errors: result.array() });
}


User.create({firstname:req.body.firstname, lastname:req.body.lastname})
.then(module=> res.status(200).send(module))
.catch(err=>res.status(400).send(err))

})

// PUT /users/:id ⇒ update a specific user
app.put('/users/:id', (req,res)=>{
    if(!req.body.firstname || !req.body.firstname){
        res.status(400).send(req.body)}

    User.findOneAndUpdate({"_id":req.params.id}, { $set: {firstname:req.body.firstname, lastname:req.body.lastname}})
    .then(module=> res.status(200).send(module))
    .catch(err=>res.status(404).send(err))
})

// DELETE /users/:id ⇒ delete a specific user
app.delete('/users/:id', (req,res)=>{
    User.findOneAndDelete({"_id":req.params.id})
    .then(module=> res.status(200).send(module))
    .catch(err=>res.status(404).send(err))
})

app.listen(port, ()=>{console.log(`Server running on http://localhost:${port}/`);})
