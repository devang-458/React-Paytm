const mongoose = require("mongoose");
const { number } = require("zod");
mongoose.connect("")

// const userSchema = mongoose.Schema({
//     firstName: String,
//     lastName: String,
//     password: String,
//     username: String
// })

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    fristName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    }

})

const User = mongoose.Model("User", userSchema)

module.exports = {
    User
}