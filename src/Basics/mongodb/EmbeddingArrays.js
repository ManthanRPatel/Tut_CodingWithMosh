const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors : [authorSchema]
}));

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId){
    const course = await Course.update({ _id: courseId }, {
        $unset:{
            'author': ''
        }
    })

}

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId)

  course.authors.push(author);
  course.save()
}

async function removeAuthor(courseId, authorId ) {
  const course = await Course.findById(courseId)
  const author = course.authors.id(authorId)
  author.remove();
  course.save()
}

removeAuthor('604478883aa04a2b917717f8', '60447986aef4222e14b60f6f')

// addAuthor('604478883aa04a2b917717f8', new Author({ name:'amy' }))

// createCourse('React Course', [
//   new Author({ name: 'MMaxmax' }) , 
//   new Author({ name: 'John' }) , 
// ]
// );
// updateAuthor('6044718a36361d4938eae230')