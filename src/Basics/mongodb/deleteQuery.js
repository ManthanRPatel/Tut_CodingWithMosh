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



async function deleteCourse(id){

    const result = await Course.deleteOne({ _id:id }); /// for single delete
    const result = await Course.deleteMany({ isPublished: true }); /// for single delete
    console.log("result", result)

    const course = await Course.findByIdAndRemove( id )
    console.log("course ", course)

} 


deleteCourse('60435f328e256140912acbf8');
