const express = require("express");
const path = require('path');
const fs = require("fs")
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));

app.get('/',(req,res)=>{
    fs.readdir('./files',(err,files)=>{
        res.render("index",{files})
    })

})

app.get('/file/:filename',(req,res)=>{
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err,filedata)=>{
    res.render('show',{filename:req.params.filename,data:filedata})

  })

})
app.get('/edit/:filename',(req,res)=>{
 
    res.render('editForm',{filename:req.params.filename})

})
app.post('/edit',(req,res)=>{
  fs.rename(`./files/${req.body.pre}`, `./files/${req.body.new}`,(err)=>{
    res.redirect('/');
  })
})


app.post('/create',(req,res)=>{
  fs.writeFile(`./files/${req.body.title.split(" ").join("")}.txt`,req.body.details, (error)=>{
    res.redirect("/")
  })
})
app.listen(3000)
