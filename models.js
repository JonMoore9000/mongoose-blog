const mongoose = require('mongoose');

//SCHEMA FOR BLOGS
const blogSchema = mongoose.Schema({
	title: {type:String, required: true},
    content: {type:String, required: true},
    author: {type:String, required: true},
    created: {type:String, required: true}
});


// INSTANCE SCHEME
blogSchema.methods.apiRepr = function() {

  return {
    id: this._id,
    name: this.name,
    content: this.cuisine,
    author: this.borough,
    created: this.grade,
  };
}

const BlogPost = mongoose.model('BlogPost', blogSchema);

module.exports = {BlogPost};