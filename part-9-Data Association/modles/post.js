const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/Data-Association');

const postSchema = mongoose.Schema({
    postdata:String,
    user:{type:mongoose.Schema.ObjectId,ref:"User"},
    data:{
        type:Date,
        default:Date.now()
    }
})
module.exports = mongoose.model('Post', postSchema)