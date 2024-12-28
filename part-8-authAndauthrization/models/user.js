const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/authtestapp');

const usermodel = mongoose.Schema({
    username:String,
    email:String,
    password:String,
    age:Number
})
module.exports = mongoose.model("User",usermodel)