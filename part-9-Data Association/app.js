const express = require('express');
const usermodel = require('./modles/user')
const postmodel = require('./modles/post')
const app = express();

app.get('/',(req,res)=>{
    res.send('hello')
})
app.get('/create',async(req,res)=>{
  let user = await usermodel.create({
    name:"raheem",
    email:"raheem@gmil.com",
    age:20,
  })
  res.send(user)
})
app.get('/post/create', async(req,res)=>{
    let post = await postmodel.create({
        postdata:"dummy data",
        user:"676d98ff316902eace4c0e80",
    });
    let user = await usermodel.findOne({_id:"676d98ff316902eace4c0e80"});
    user.post.push(post._id)
    await user.save();
    res.send({post,user})
})

app.listen(3000)