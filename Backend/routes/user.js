const express = require('express')
const zod = require("zod")
const { User } = require('../db')
const router = express.Router()
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require('../conifg')

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstname: zod.string(),
    password: zod.string()
})

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post("/signup",async (req,res)=>{
    const body = req.body;
    const {success} = signupSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg: "Email is already Taken/ Incorrect inputs"
        })
    }

    const user =  await User.findOne({
        username: body.username
    })

    if(user._id){
        return res.status(411).json({
            message: "Email is already Taken/ Incorrect inputs"
        })
    }

    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET)

    const dbUser = await User.create(body)
    res.status(200).json({
        msg: "User created successfully",
        token: token
    })

})

router.post("signin",(req,res)=>{
    const body = req.body;
    const {success} = signinSchema.safeParse(req.body);
    if(!success){
        res.status(411).json({
            msg: "Incorrect Inputs"
        })
    }

    const user = User.findOne({
        username : req.body.username,
        password : req.body.password

    })
    if(user){
        const token = jwt.sign({
            userId : user._id
        }, JWT_SECRET)

        res.json({
            token: token
        })
    }

    res.json({
        msg: "Error while logging in"
    })
})

module.exports = router;

