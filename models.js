const mongoose = require('mongoose');

//SCHEMA FOR BLOGS
const blogPostSchema = mongoose.Schema({
	  title: {type: String, required: true},
    content: {type: String},
    author: {
      firstName: String, 
      lastName: String
    },
    created: {type: Date, default: Date.now}
});


// VIRTUAL INSTANCE
blogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim()});


// INSTANCE SCHEME
blogPostSchema.methods.apiRepr = function() {

  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorName,
    created: this.created,
  };
}

const BlogPost = mongoose.model('Blogs', blogPostSchema);

module.exports = {BlogPost};