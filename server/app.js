const express = require('express')
const app = express()
const PORT = 5000 
const mongoose = require("mongoose")
const {MONGOURI}=require('./keys')
const bcrypt = require('bcryptjs')


mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected',()=>{
    console.log("connected to mongo. yeah baby!!")
})

mongoose.connection.on('error',(err)=>{
    console.log("err connecting",err)
})

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))
// zULySnUdcElDpWAt

// const customMiddleWare = (req, res, next)=>{
//     console.log("middleware")
//     next()
// }
// this make it for all
// app.use(customMiddleWare)

// app.get('/',(req,res)=>{
//     console.log("home")
//     res.send("hello wrld")
// })

// this will make it work for this only
// app.get('/about', customMiddleWare,(req,res)=>{
//     console.log("about")
//     res.send("this is about page")
// })

app.listen(PORT,()=>{
    console.log("server is running", PORT)
})