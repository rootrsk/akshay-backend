const express = require('express')
const User = require('../models/user')

// const userAuth = require('../middleware/userAuth')
// const {userErrorHandler} = require('../middleware/error')

const router = new express.Router()

router.get('/',(req,res)=>{
    res.send({
        status: 'success',
        status_code: 200,
        message:"Welcolme to rest api.",
        
    })
})

router.post('/api/auth/signup',async(req,res)=>{    
    try {
        const user = new User({
            name:req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        })
        await user.save()
        const token = user.genAuthToken()
        
        user.tokens = user.tokens.concat({
            token: token,
            browser: req.useragent.browser,
            device: req.useragent.os
        })
        res.send({
            message: 'Account created successfully.',
            success:true,
            user: user,
            token,
            cookies: req.cookies
        })

    } catch (e) {
        const error = userErrorHandler(e.message)
        res.send({
            message: 'failed',
            error,
            success:false
        })
    }
})

router.post('/login',async(req,res)=>{

    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = user.genAuthToken()
        user.tokens = user.tokens.concat({
            token: token,
            browser: req.useragent.browser,
            device: req.useragent.os
        })
        res.send({
            message:'success',
            user:user,
            token,
        })
    } catch (e) {
        res.send({
            message: 'failed',
            error: e.message
        })
    }
})

// router.get('/user/me',userAuth,async(req,res)=>{
//     res.json({
//         status: 'success',
//         isAutheticated: true,
//         user:req.user
//     })
// })


module.exports = router