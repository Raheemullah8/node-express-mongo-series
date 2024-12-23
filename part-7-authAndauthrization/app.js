const express = require('express');
const app = express();
app.get('/',(req,res)=>{
    res.cookie('name','raheem')
    res.send('indexpage')
});
app.listen(3000)
