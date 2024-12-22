const express = require('express');
const app = express();
const path = require('path');
const userSchema = require('./model/user')

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
  res.render('index')
});
app.get('/read', async (req,res)=>{
  let user = await userSchema.find()
  res.render("read",{user} )
});
app.get('/edit/:userid', async (req,res)=>{

  let user = await userSchema.findOne({_id:req.params.userid})
  res.render('update',{user})

});
app.post('/updatedata/:userid',async(req,res)=>{
  let {name,email,image} = req.body;
let user = await userSchema.findOneAndUpdate({_id:req.params.userid},{name,email,image},{new:true});
res.redirect('/read')
}) 

app.post('/create', async (req,res)=>{
  try {
    let {name,email,image} = req.body;
    if(!name || !email || !image){
      return res.status(400).json({error:"All Feaild are required"});
    }
    let createUser = await userSchema.create({
      name,
      email,
      image
    });
    res.redirect('/read')
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });    
  }
})
app.post('/delete/:id',async (req,res)=>{
  const user = await userSchema.findOneAndDelete({_id:req.params.id});
  res.redirect('/read') ;
})

app.listen(3000);
