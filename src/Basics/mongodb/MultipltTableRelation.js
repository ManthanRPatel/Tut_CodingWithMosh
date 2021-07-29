
///// for maultiple table

/// 2 approaches

//// course,, - author ,
/// Trade off between query performance and consisitency 

/// 1.. using references (Normalization)
//// 2.. using Embedded Documents(denormalization)


/// 1.. using references (Normalization) -- consisitency,,, 
let author = {
    name: 'Mosh'
}

let course = {
    author: 'id',
    // authors:['id1','id2','id3'],

}
/// there is no relation between them ,,,, 



//// 2.. using Embedded Documents(denormalization) -- peromance,, consistency 
let course = {
    author:{
        name:'Mosh',
    }
}
/// embedding whole document in another document 


////// HyBird Approach
let author ={
    name:'Mosh'
    //// 50 other properties
}
let course = {
    author: {
        id:'ref',
        name:'Mosh',
    }
}

