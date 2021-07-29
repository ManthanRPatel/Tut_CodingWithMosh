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


/// normal query
async function getCourses() {

    const courses = await Course
        .find({ isPublished: true, tags: { $in: ['backend','backend'] }  }) ///// course that  have tags frontend or backend tags
        .limit(10)
        .sort('-price') /// 1 for ascending order,,, name: -1 for descending order
        .select('name author price') /// select properties that you want to return 

        ///// or

    const courses = await Course
        .find({ isPublished: true }) ///// course that  have tags frontend or backend tags
        .or([{ tags: 'frontend'},{ tags:'backend' }])
        .limit(10)
        .sort('-price') /// 1 for ascending order,,, name: -1 for descending order
        .select('name author price') /// select properties that you want to return 

    console.log("courses ", courses)
}



getCourses();