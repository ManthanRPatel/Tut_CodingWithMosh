const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/playground')
    .then(() => {
        console.log("Connected to Mongodb")
    })
    .catch(err => {
        console.log("Errror", err)
    })

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
})

/// compile schema into models for creating instances
const Course = mongoose.model('Course', courseSchema); /// course is a class... thats why it is pascal case



/// approaches
/// 1. query first
//// findById()
/// modify its property
/// save()

/// 2. update first
//// Update directly
/// optionally: we get the updated document


/// for bussinsee
async function updateCourses(id) {

   const course = await Course.findById(id);
    if(!course){
        return;
    }
    else{

        if(!course.isPublished) return;

        course.isPublished = true;
        course.isUpdated = true;
        course.author = 'another author';

        /// or
        // course.set({
        //     isPublished:true,
        //     author: 'another author'
        // })
        let result = await course.save();
        console.log("result ", result)
    }
}

async function updateCoursesDirectly(id){

    /// update all that isPublished = true 
    // const course = await Course.update({ isPublished : true });
    // const result = await Course.update({_id: id },{
    //     $set:{
    //         author:'Macmax',
    //         isPublished: false,
    //     }
    // });
    // console.log("result ", result)

    const course = await Course.findByIdAndUpdate(id ,{
        $set:{
            author:'Macmax',
            isPublished: true,
        }
    },{ new: true });

    console.log("course", course)
} 


// updateCourses('60435f328e256140912acbf8');
updateCoursesDirectly('60435f328e256140912acbf8');
