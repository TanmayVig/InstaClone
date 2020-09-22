const mongoose=require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },pic:{
        type:String,
        default:"https://res.cloudinary.com/tanmay-vig/image/upload/v1600605465/no-image_ha5sov.jpg"
    },
    followers:[{type:ObjectId, ref:"User"}],
    following:[{type:ObjectId, ref:"User"}],
})

mongoose.model('User',userSchema)