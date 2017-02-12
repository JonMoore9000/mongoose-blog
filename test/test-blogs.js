const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// this makes the should syntax available throughout
// this module
const should = chai.should();

const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedBlogData() {
  console.info('seeding blog post data');
  const seedData = [];
  for (let i=1; i<=10; i++) {
    seedData.push({
      author: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      },
      title: faker.lorem.sentence(),
      content: faker.lorem.text()
    });
  }
  // this will return a promise
  return BlogPost.insertMany(seedData);
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}


// WILL RUN SERVER
// SEED DATE
// TEAR DOWN DB
// CLOSE SERVER
describe('BlogPosts API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedBlogData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  })

// GET
  describe('GET endpoint', function() {

    it('should return all existing blogs', function() {
      
      let res;
      return chai.request(app)
        .get('/posts')
        .then(function(_res) {
          
          res = _res;
          res.should.have.status(200);
         
          res.body.should.have.length.of.at.least(1);
          return BlogPost.count();
        })
        //.then(function(count) {
          //res.body.should.have.length.of(count);
        //});
    });


    it('should return blogs with right fields', function() {

      let resBlog;
      return chai.request(app)
        .get('/posts')
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);

          res.body.forEach(function(blog) {
            blog.should.be.a('object');
            blog.should.include.keys(
              'title', 'content', 'author');
          });
          resBlog = res.body[0];
          return BlogPost.findById(resBlog.id);
        })
        .then(blog => {

          resBlog.id.should.equal(blog.id);
          resBlog.title.should.equal(blog.title);
          resBlog.content.should.equal(blog.content);
          resBlog.author.should.equal(blog.authorName);
        });
    });
  });

// POST
  describe('POST endpoint', function() {
    
    it('should add a new blog', function() {

      const newPost = {
        title: faker.lorem.sentence(),
        author: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      },
      content: faker.lorem.text()
    };

      return chai.request(app)
        .post('/posts')
        .send(newPost)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'id', 'title', 'content', 'author', 'created');
          res.body.title.should.equal(newPost.title);
          res.body.id.should.not.be.null;
          res.body.author.should.equal(
            `${newPost.author.firstName} ${newPost.author.lastName}`);
          res.body.content.should.equal(newPost.content);
          return BlogPost.findById(res.body.id).exec();
        })
        .then(function(post) {
          post.title.should.equal(newPost.title);
          post.content.should.equal(newPost.content);
          post.author.firstName.should.equal(newPost.author.firstName);
          post.author.lastName.should.equal(newPost.author.lastName);
        });
    });
  });

// PUT
  describe('PUT endpoint', function() {

    it('should update fields you send over', function() {
      const updateData = {
        title: 'fofofofofofofof',
        content: 'futuristic fusion'
      };

      return BlogPost
        .findOne()
        .exec()
        .then(function(blog) {
          updateData.id = blog.id;
          return chai.request(app)
            .put(`/posts/${blog.id}`)
            .send(updateData);
        })
        .then(function(res) {
          res.should.have.status(204);

          return BlogPost.findById(updateData.id).exec();
        })
        .then(function(blog) {
          blog.title.should.equal(updateData.title);
          blog.content.should.equal(updateData.content);
        });
      });
  });

// DELETE
  describe('DELETE endpoint', function() {
    
    it('delete a blog by id', function() {

      let blog;

      return BlogPost
        .findOne()
        .exec()
        .then(function(_blog) {
          blog = _blog;
          return chai.request(app).delete(`/posts/${blog.id}`);
        })
        .then(function(res) {
          res.should.have.status(204);
          return BlogPost.findById(blog.id).exec();
        })
        .then(function(_blog) {
          
          should.not.exist(_blog);
        });
    });
  });
});
