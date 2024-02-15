const express = require('express')
const zod = require("zod")
const { User, Account } = require('../db')
const router = express.Router()
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require('../conifg')
const bcrypt = require("bcrypt")
const { authMiddleware } = require('./middleware')


const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstname: zod.string(),
    password: zod.string()
})



router.post("/signup",async (req,res)=>{
    const body = req.body;
    const {success,data} = signupSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg: "Email is already Taken/ Incorrect Input"
        })
    }

    data.password = await bcrypt.hash(data.password, 10)

    const user =  await User.findOne({
        username: body.username
    })

    if(user && user._id){
        return res.status(411).json({
            message: "User already exist"
        })
    }
    const dbUser = await User.create(body)

    await Account.create({
        userId: dbUser._id,
        balance: 1 + Math.random() * 10000

    })

    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET)

    res.status(200).json({
        msg: "User created successfully",
        token: token
    })

})

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})


router.post("signin", async (req,res)=>{
    const body = req.body;
    const {success} = signinSchema.safeParse(req.body);
    if(!success){
        res.status(411).json({
            msg: "Incorrect Inputs"
        })
    }

    try{
        const user = await User.findOne({
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
    }catch(error){
        return res.status(500).json({
            msg: "error while logging in",
            error: error.message
        })
    }

    return res.status(401).json({
        msg: "Invaild credentials"
    })
})


const updateBody = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional()
})

router.put("/", authMiddleware, async (req,res)=>{
    const {success} = updateBody.safeParse(req.body)
    if(!success){
        res.status(411).json({
            msg: "Error while updating infomation"
        })
    }

    await User.updateOne(req.body,{
        id: req.userId
    })

    res.json({
        msg: "Updated successfully"
    })
})

router.get("/bulk", async (req,res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstname: {
                "$regex": filter
            }
        },{
            lastname: {
                "$regex" : filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    })
})


module.exports = router;

