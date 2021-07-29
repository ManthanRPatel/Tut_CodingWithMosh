const { User , validate} = require('../models/user.model');
const Token = require('../models/token.model');
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const _ = require('lodash')
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const sendEmail = require("../utils/emails/sendEmail");
const crypto = require("crypto");
const CONFIG = require('../config/config')


router.get('/me',auth, async (req,res)=>{
    const user = await User.findById( req.user._id ).select('-password');
    res.send(user)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findOne({ email : req.body.email })
    if(user) return res.status(400).send('User already exists');

    user = new User(_.pick(req.body, ['name','email','password']))

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash( user.password , salt);

    await user.save();
    const access_token = user.generateAuthToken();

    res.send({ status: true, access_token , data: _.pick(user,['_id','name','email']) })
    // res.header('x-auth-token',access_token ).send(_.pick(user,['_id','name','email']));
});

router.post('/register', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findOne({ email : req.body.email })
    if(user) return res.status(400).send({ status:false ,message:'User already exists'});

    user = new User(_.pick(req.body, ['name','email','password']))

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash( user.password , salt);

    await user.save();

    user.generateConfirmEmail()
    .then(respose=>{
        res.send({ status:true, message:'Check Account for email registreation', data: _.pick(user,['_id','name','email']) });
    })
    .catch(err=>{
        console.log("err ", err )
        res.send({ status:false, message:'Something went wrong'  });
    })
});


router.get('/confirmation/:token', async (req,res)=>{
    try{
        const decoded = jwt.verify(req.params.token,  config.get('emailPrivateKey'));
        await User.findByIdAndUpdate( decoded._id  ,{
            $set:{
                confirmed: true,
            }
        },{ new: true });
        return res.redirect(`${CONFIG.clientURL}/api/auth/login`);
    }
    catch(err){
        console.log(err)
        res.send({ status:false, message:'Something went wrong'  });
    }
})

router.post('/forgotpassword',async(req,res)=>{
    try{
        let { email}  = req.body;
        const user = await User.findOne({ email });
        if(!user) return res.send({ status:false, message:"user doesn't exists" });

        let token = await Token.findOne({ userId: user._id })

        if(token){
            await Token.findByIdAndRemove(token._id);
        }

        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, Number(CONFIG.bcryptSalt));

        await new Token({
            userId: user._id,
            token: hash,
            createdAt: Date.now(),
        }).save();

        user.generateResetPassEmail(resetToken)
        return res.send({ status:true, message: 'Email sent for reset password is sent.' });
        // return res.send({ status:true, message: { resetToken , userId: user._id } });
    }
    catch(err){
        console.log("err ", err)
        return res.send({ status:false, message:'SOmething went wrong!!!' })
    }
})

router.post('/resetPassword',async(req,res)=>{
    try{
        let { userId, token, password } = req.body;
        let passwordResetToken = await Token.findOne({ userId });
  
        if(!passwordResetToken) return res.send({ status:false,message:"Invalid or expired password reset token" })

        const isValid = await bcrypt.compare(token, passwordResetToken.token);

        if(! isValid)  return res.send({ status:false,message:"Invalid or expired password reset token" })

        const hash = await bcrypt.hash(password, Number(CONFIG.bcryptSalt));

        await User.updateOne(
            { _id: userId },
            { $set: { password: hash } },
            { new: true }
        );

        const user = await User.findById(userId);

        user.generateResetPassSuccessEmail();

        await Token.findByIdAndRemove(passwordResetToken._id);

        return res.send({ status:true, message:'password reset successfully' })
    }
    catch(err){
        console.log("err ", err)
        return res.send({ status:false, message:'SOmething went wrong!!!' })
    }
})


module.exports = router