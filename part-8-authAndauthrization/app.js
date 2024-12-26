const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userModel = require("./models/user");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/create", async (req, res) => {
  let { username, email, password, age } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(password,salt);
  let user = await userModel.create({
    username,
    email,
    password:hashpassword,
    age,
  });
  const token = jwt.sign(email,'hsdjsfghasdysdagiufgusdfygsdkfgsh');
  res.cookie("token",token)

  res.send(user);
});
app.get('/logout',(req,res)=>{
  res.cookie("token","")
  res.redirect("/")
})
app.get('/login',(req,res)=>{
  res.render('login')
})
app.post('/loginuser',async(req,res)=>{
  let {email,password} = req.body;
  if(!email || !password){
    return res.send("email and password are not require")
  }
  let user = await userModel.findOne({email})
  if (!user) {
    return res.status(404).send('User not found');
  }
  bcrypt.compare(password,user.password,(err,result)=>{
    if(result){
      res.send("you can login")
    }else{
      res.send("some thing woring")
    }
  })
})

app.listen(3000);
