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


// classes, objects
// human, john(instance)
/// Courses, node courses



/// compile schema into models for creating instances
const Course = mongoose.model('Course', courseSchema); /// course is a class... thats why it is pascal case


async function createCourse() {
    //// create 
    const course = new Course({
        name: 'Reactjs Course',
        author: 'Macmax',
        tags: ['React', 'backend'],
        isPublished: true,
    })

    const result = await course.save();
    console.log("result ", result)
}

/// normal query
async function getCourses() {

    /// eq (equal )
    /// ne( not equal)
    /// gt( greater than )
    /// gte( greater than or equal to )
    /// lt( less than )
    /// lte( less than or equal )
    /// lt( less than )
    /// in
    /// nin ( not in)


    const courses = await Course
        // .find({ author:'Macmax' })
        // .find({ price: { $gte: 10, $lte: 20 } }) /// for opertor we use $ and shows greater than or equal to 10 and less than or equal to 20
        .find({ price: { $in : [10 ,15 ,20] } }) ///// course that price is 10$ or 20$ or 15 $
        .limit(10)
        .sort({ name: 1 }) /// 1 for ascending order,,, name: -1 for descending order
        .select({ name:1, tags:1 }) /// select properties that you want to return 


    console.log("courses ", courses)
}

/// and or
async function getCourses2() {

    /// and
    ///or 

    const courses = await Course
        .find()
        .or([{ author: 'macmax' },{ isPublished: true }]) /// author : macmax or isPublished: true hoy teva
        .and([{ author: 'macmax' },{ isPublished: true }]) /// author : macmax and isPublished: true hoy teva .... it is already 
        .limit(10)
        .sort({ name: 1 }) /// 1 for ascending order,,, name: -1 for descending order
        .select({ name:1, tags:1 }) /// select properties that you want to return 

    console.log("courses ", courses)
}

/// regular expression ,, uses javscript regular expressions 
async function getCourses3() {

    const courses = await Course

        //// author that starts with Macmax
        .find({ author: /^Macmax/ }) 

        //// author that ends with patel ,,, case insensitive
        .find({ author: /patel$/i }) 

        //// author that contains  mosh ,,, case insensitive
        .find({ author: /.*Mosh.*/i }) 

        .limit(10)
        .sort({ name: 1 }) /// 1 for ascending order,,, name: -1 for descending order
        .select({ name:1, tags:1 }) /// select properties that you want to return 

    console.log("courses ", courses)
}

/// .select('name author') /// it is also valid ...

/// count - number of document
async function getCourses4() {

    //// required to write find
    const courses = await Course
        .find({ author:'Macmax' })
        .limit(10)
        .sort({ name: 1 }) /// 1 for ascending order,,, name: -1 for descending order
        .count()
    console.log("courses ", courses)
}

//// pagination
async function getCoursesPagination() {

    const PageNumber = 2;
    const pageSize = 10;

    //// required to write find
    const courses = await Course
        .find({ author:'Macmax' })
        .skip((PageNumber -1)* pageSize)
        .limit(pageSize)
        .sort('name') /// ascending order,,, -name descending order
        .count()
    console.log("courses ", courses)
}

// createCourse();
getCourses4();
