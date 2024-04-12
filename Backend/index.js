const express = require("express");
const mainRouter = require("./routes/index");
const cors = require('cors');
const app = express();
const jwt = require("jsonwebtoken")
const url = process.env.MONGO_URL
console.log(url)


app.use(cors());
app.use(express.json())
app.use("/api/v1", mainRouter);


app.listen(3000,()=>{
    console.log("server is running")
});