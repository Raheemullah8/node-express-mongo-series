const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:"user"},
    date:{
        type:date,
        default:Date.now()
    },
    content:String,
    like:[
        {type:mongoose.Schema.Types.ObjectId,ref:"user"}
    ]
})
module.exports = mongoose.model('post',postSchema)