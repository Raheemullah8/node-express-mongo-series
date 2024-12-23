// JWT token ko cookie mein store karne aur verify karne ka functionality add kiya gaya hai.
//  Ab cookie ke zariye JWT token ko read aur verify kiya ja sakta hai.

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const cookieParser = require('cookie-parser')

app.use(cookieParser());

app.get('/', (req, res) => {
   let token = jwt.sign({email:"raheem@gmail.com"},"secret");
   console.log("token=>",token)
   res.cookie("jwttoken",token)
    res.send("home")
});

app.get('/read', (req, res) => {
    let data = jwt.verify(req.cookies.jwttoken,"secret");
    console.log('data =>',data)
    res.send('read cookie');
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


