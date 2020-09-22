const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const requireLogin = require("../middleware/requireLogin")
const Post = mongoose.model("Post")
const User = mongoose.model('User')


router.get("/user/:id",requireLogin,(req,res)=>{
    User.findById({_id:req.params.id})
    .select("-passoword")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,post)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user,post})
        })
    }).catch(err=>{
        return res.status(404).json({error:"user not found"})
    })
})

router.put("/follow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followid,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followid},

        },{
            new:true
        }).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put("/unfollow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowid,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowid},

        },{
            new:true
        }).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put('/updatepic',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
            if (err) {
                return res.status(422).json({error:err, error_message: "pic cannot post"})   
            }
            res.json(result)
        })
})

router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id email")
    .then(user=>res.json({user}))
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router
