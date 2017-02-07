const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;

const {BlogPost} = require('./models');

const app = express();
app.use(bodyParser.json());

app.use(morgan('common'));

//THIS WHERE THE ENDPOINT SETUP GOES


// GET
app.get('/blog-posts', (req, res) => {
  BlogPost
    .find()
    .limit(10)
    .exec()
    .then(blog => {
      res.json({
        blog: blog.map(
          (blog) => blog.apiRepr())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});