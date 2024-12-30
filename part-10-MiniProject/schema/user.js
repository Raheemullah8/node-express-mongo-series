const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MiniProject');

const userSchema = mongoose.Schema({
    username:String,
    name:String,
    email:String,
    password:String,
    age:String,
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }]
})
module.exports = mongoose.model("user",userSchema);