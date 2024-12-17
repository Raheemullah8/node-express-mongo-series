const express = require("express");
const path = require("path");
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get('/',(req,res)=>{
    res.render("index")
});
app.get('/profile/:username',(req,res)=>{
 res.send(`UserName: ${req.params.username}`);
})
app.get('/author/:username/:age',(req,res)=>{
    res.send(`welcome to ${req.params.username} And Your Age Is ${req.params.age}`)
})
app.listen(3000,()=>{
    console.log("Running");
})

// Initial setup of Express app with EJS template engine and static file serving

// - Set up Express server to serve static files from "public" directory
// - Configured EJS as the view engine
// - Created routes to render views and handle dynamic parameters:
//   - Root route ("/") to render index.ejs
//   - Dynamic routes for user profile and author information
// - Basic Express app structure for further development
