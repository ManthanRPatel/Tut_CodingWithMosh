const p = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(1);
        reject(new Error('messge'))
    },2000)
})

p.then(res=>console.log("ress",res))
.catch(error=>console.log("error ",error.message))




////// neew style
const p1 = new Promise((resolve)=>{
    setTimeout(()=>{
        console.log("async 1 opertaion")
        resolve(1);
    },2000)
})

const p2 = new Promise((resolve)=>{
    setTimeout(()=>{
        console.log("async 1 opertaion")
        resolve(2);
    },2000)
})

Promise.all([p1,p2]).then(res=>{
    console.log("res ===" ,res)  //// res ===[1,2]
})
.catch(err=> console.log("error",err))



////// async await

