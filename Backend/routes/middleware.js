
const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization

    if(!authHeader || authHeader.startsWith("Bearer ")){
        return res.status(403).json({})
    }

    const token = authHeader.split(" ")[1]

    try{
        const decoded = jwt
    }
}