exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
					  'mongodb://Jon:allison9@ds145649.mlab.com:45649/blog-challenge';
exports.PORT = process.env.PORT || 8080;