const { User } = require('../models/user.model');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const _ = require('lodash')
const crypto = require('crypto');
const Joi = require('joi');
const config = require('config');

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findOne({ email : req.body.email })
    if(!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare( req.body.password, user.password )
   
    if(!validPassword) return res.status(400).send('Invalid email or password');
    
    const access_token = user.generateAuthToken();

    res.send({access_token});
});

router.get('/login',(req,res)=>{
  res.send({ message:'Welcome to login Page', status:true })
})

router.post('/login', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email : req.body.email })
  if(!user) return res.status(400).send({ status: false, message:'Invalid email or password'});

  if(!user.confirmed) return res.status(400).send({ status: false, message:'Please confirm your email to login.'});

  const validPassword = await bcrypt.compare( req.body.password, user.password )
 
  if(!validPassword) return res.status(400).send({ status: false, message:'Invalid email or password'});
  
  const access_token = user.generateAuthToken();

  res.send({access_token});
});


function validate(req) {
    const schema = {
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(req, schema);
}

module.exports = router