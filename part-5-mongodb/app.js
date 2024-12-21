const express = require("express");
const usermodel = require("./usersmodel")
const app = express();

app.get('/',(req,res)=>{
    res.send('hello')
})
app.get('/create', async (req,res)=>{
    let createuser = await usermodel.create({
       name:"raheem",
       username:"raheem ullah",
       email:"raheem@gmail.com"
    });
    res.send(createuser)
})
app.get('/update', async (req, res) => {
    try {
        
        let updateuser = await usermodel.findOneAndUpdate(
            { username: "raheem ullah" },
            { name: "kashif" },
            { new: true }  
        );

        
        if (!updateuser) {
            return res.status(404).send("User not found");
        }
  res.send(updateuser);
    } catch (error) {
       
        console.error(error);
        res.status(500).send("Something went wrong while updating the user");
    }
});
app.get('/read', async(req,res)=>{
    let readuser = await usermodel.find({})
    res.send(readuser)
  })
app.get('/delete', async(req,res)=>{
  let deleteUser = await usermodel.findOneAndDelete({name:"kashif"});
  res.send(deleteUser);
})

app.listen(3000);