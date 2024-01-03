require("dotenv").config()
require("./src/config/db")
const express = require("express")
const userRouter = require("./src/routes/user")

const PORT = process.env.PORT || 3001

const app = express()


app.use(userRouter)
app.listen(PORT,()=>{
    console.log(`Server started at port : ${PORT}`)
})