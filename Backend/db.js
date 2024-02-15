const mongoose = require("mongoose");
const { number } = require("zod");
mongoose.connect("")
const bcrypt = require("bcrypt")


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

const { default: mongoose } = require("mongoose");

const accountSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})


userSchema.methods.createHash = async function(plainTextPassword){
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    return await bcrypt.hash(plainTextPassword, salt)
};

userSchema.methods.validatePassword = async function (candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password)
}

const Account = mongoose.model("Account", accountSchema)
const User = mongoose.Model("User", userSchema)

module.exports = {
    User,
    Account
}