
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost');

const userSchema  = mongoose.Schema({
    name:String,
    username:String,
    email:String,
    
})
module.exports = mongoose.model("User",userSchema)