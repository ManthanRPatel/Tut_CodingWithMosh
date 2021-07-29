const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/playground')
    .then(() => {
        console.log("Connected to Mongodb")
    })
    .catch(err => {
        console.log("Errror", err)
    })

const courseSchema = new mongoose.Schema({
    name: { 
         type: String,
         required : true, 
         minlength: 5, 
         maxlength: 255,
        //  match: /pattern/
    },
    catgory:{
        type: String,
        required: true,
        enum:['web','mobile','network'],
    },
    author: { 
        type: String, 
        // lowercase: true,
        uppercase: true,
        trim: true,
    },
    tags: {
        type: Array,
        validate: {
            validator:function(v){
                return (v && v.length > 0); 
            },
            message: 'A course should have at least one tag.'
        }
    },
    ///// async validator
    // tags: {
    //     type: Array,
    //     validate: {
    //         isAsync: true,
    //         validator:function(v, callback){
    //             setTimeout(()=>{
    //                 /// do async work 
    //                 const result = (v && v.length > 0); 
    //                 callback(result)
    //             },3000)
    //         },
    //         message: 'A course should have at least one tag.'
    //     }
    // },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: { 
        type: Number,
        min: 10,
        max:200,
        required:function(){ return this.isPublished },
        get:v=> Math.round(v),
        set:v=> Math.round(v),
    } //// that means if isPublished is true then price is required...
})


/// compile schema into models for creating instances
const Course = mongoose.model('Course', courseSchema); /// course is a class... thats why it is pascal case



async function createCourse() {
    try{
        const course = new Course({
            name: 'Reactjs Course',
            author: ' Macmax Dhoom Machale ',
            catgory:'web',
            tags: ['web'],
            isPublished: true,
            price: 15.67
        })
        // await course.validate(err=>{
        //     if(err) return;
        // });
        const result = await course.save();
        console.log("result ", result)
    }
    catch(err){
        /// for error s
        for(field in err.errors){
            console.log(err.errors[field].message)
        }
    }
}

async function getCourses() {

    const courses = await Course
        .find({ _id:'604396eb190dd934a85d9fb7'  })  
        // .limit(10)
        // .sort({ name: 1 })

    console.log("courses ", courses)
}


// createCourse();
getCourses();