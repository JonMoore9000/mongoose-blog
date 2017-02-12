exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
					  'mongodb://Jon:allison9@ds145649.mlab.com:45649/blog-challenge';

exports.TEST_DATABASE_URL = (
	process.env.TEST_DATABASE_URL ||
	'mongodb://Jon:allison9@ds151059.mlab.com:51059/blog-test-db');

exports.PORT = process.env.PORT || 8080;