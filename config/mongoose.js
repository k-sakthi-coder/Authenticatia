const mongoose = require('mongoose');
//fill your database name here

mongoose.connect(
  'mongodb+srv://mechonsakthi44:klsalkthi333@cluster0.ulg7oer.mongodb.net/',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on('error', console.error.bind('console', 'error'));

db.once('open', function () {
  console.log('welcome connect to database');
});

module.exports = db;
// const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1/NodeJS_Auth');

// const db = mongoose.connection;

// db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


// db.once('open', function(){
//     console.log('Connected to Database :: MongoDB');
// });


// module.exports = db;
