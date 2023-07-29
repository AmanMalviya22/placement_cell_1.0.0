const express=require('express');
const port=process.env.PORT || 8000;
const app=express();

app.listen(port,function(err){
    if(err){
        console.log('err in listening');
        return;
    }
    console.log('server is listening on port ',port);
})


