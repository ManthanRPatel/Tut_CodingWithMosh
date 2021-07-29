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


/// corses which price is greater than or equal to 15 or  name contains by
async function getCourses() {

    const courses = await Course
        .find({ isPublished: true })
        .or([
            { price:{ $gte: 15 } },
        { name: /.*by.*/i }
        ]) 
        .sort('-price')  
        .select('name author price')  

    console.log("courses ", courses)
}



getCourses();