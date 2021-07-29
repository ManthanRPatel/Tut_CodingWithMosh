const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
require('express-async-errors');
const mongoose = require('mongoose');
const genres = require('./express/routes/genres.controller');
const customers = require('./express/routes/customers.controller');
const movies = require('./express/routes/movies.controller');
const rentals = require('./express/routes/rentals.controller');
const Users = require('./express/routes/Users.controller');
const auth = require('./express/routes/auth.controller');
const errorHandler = require('./express/middleware/errorHandler')
const config = require('config');
require("dotenv").config();
const winston = require('winston');
require('winston-mongodb');


if(!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR : jwtPrivateKey is not defined.')
  process.exit(1); /// if the value is  1 then process will be terminanted
  /// if 0 then success
}

const express = require('express');
const app = express();


winston.add( winston.transports.File, { filename: 'logfile.log' } );
winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/vidly' } )


mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));


// console.log("Node Env", process.env.NODE_ENV)
// console.log("app : ", app.get('env'))


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'))

///// middleware
// app.use(function(req,res,next){
//     console.log("first onw")
//     next();
// })
// app.use(function(req,res,next){
//     console.log("next one")
//     next();
// })

// if(app.get('env') === 'development'){
// }



app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', Users);
app.use('/api/auth', auth);


app.use(errorHandler);


// app.get('/course/:id',(req,res)=>{
//     const schema = {
//         name : Joi.string().min(3).required(),
//     }
//     Joi.validate(req.body)
//     /// validate.,, if invalid ,,, return 400, Bad request
//     //// update course  ,,, retuurn updated course
//     res.send(req.params.id)
// })
// app.get('/app/:year/:month',(req,res)=>{
//     console.log(req.params , req.query)
//     res.status(404).send('Not Found')
// })

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=> console.log(`Listening on ${PORT}......`))