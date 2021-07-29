const fs = require('fs');

//// synchronous ,, not recommended
const files = fs.readdirSync('./'); 
console.log("sync files  ",files)

//// asynchronous ,, highly recommended
fs.readdir('./',(err,files)=>{
    if(err){
        console.log("error ", err)
    }
    else{
        console.log("async files  ",files)
    }
});