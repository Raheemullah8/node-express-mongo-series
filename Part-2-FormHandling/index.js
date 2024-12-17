const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(function(req,res,next){
  console.log("first Middleware")
  next();
})

app.get('/',(req,res)=>{
  res.send("This is home page");
})
app.get('/About',(req,res)=>{
    res.send("This is about page");
  })
  app.get('/profile',(req, res, next)=>{
    return next(new Error("Something wrong"));
  })
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something wrong in profile route');
});
  app.listen(3000)