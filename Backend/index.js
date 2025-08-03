const express = require("express");
const mainRouter = require("./routes/index");
const cors = require('cors');
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

const app = express();
const url = process.env.MONGO_URL
console.log(url)


app.use(cors());
app.use(express.json())
app.use("/api/v1", mainRouter);


app.listen(3000,()=>{
    console.log("server is running")
});