const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET}=require("../keys")
const requireLogin = require("../middleware/requireLogin")


router.get('/protected',requireLogin,(req,res)=>{
    res.send('hello user')
})

router.post('/signup',(req,res)=>{
    const {name,email,password,pic}=req.body
    if(!email || !password || !name){
        // status code 200 means every thing is allright, 422 means inprocessable data
        return res.status(422).json({error:"please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exits with that email"})
        }
        bcrypt.hash(password,10)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name,
                pic,
            })
            user.save()
            .then(user=>{
                res.json({message:"saved sucessfull"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
        
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    const {email, password} =req.body
    if(!email || !password){
        res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:req.body.email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"invalid Email or Password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id, name, email, followers, following,pic} = savedUser 
                res.json({token,user:{_id,name,email,followers,following,pic},message:"logged in sucessfully"})
            }
            else{
                return res.status(422).json({error:"invalid password or email didnt match"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

module.exports = router