const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/Data-Association');

const userSchema = mongoose.Schema({
    name:String,
    email:String,
    age:Number,
    post:[
        {type:mongoose.Schema.ObjectId,ref:'Post'}
    ]
})
module.exports = mongoose.model('User', userSchema)