console.log("Before");

getUser(1,(user)=>{
    console.log("user",user)

    //// get the repository
    getGitHubRepo(user.getId,(repos)=>{
        console.log("Repos ::",repos)
    })
})
console.log("AFter");


function getUser(id,callback){
    setTimeout(()=>{
        console.log("Reading from databse");
        callback({id: id, getId:'Macmax'})
    },2000)
}

function getGitHubRepo(username,callback) {
    setTimeout(()=>{
        console.log("Reading from github databse");
        callback(['repo1','repo2','repo3']);
    },2000)
}