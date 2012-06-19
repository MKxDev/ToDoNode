
/**
 * Module dependencies.
 */

var databaseUrl = 'mongodb://localhost/todonode'; // "username:password@example.com/mydb"
var collections = ['users', 'lists'];
var mongoose = require('mongoose');
mongoose.connect(databaseUrl);

var utils = require('./utils');
var express = require('express');
var models = require('./models')({ mongoose: mongoose, utils: utils });
var providers = require('./providers')({models: models, mongoose: mongoose, utils: utils});
var passport = require('./auth')({providers: providers});
var controllers = require('./controllers')({providers: providers, passport: passport});
var routes = require('./routes.js');

var app = module.exports = express.createServer();
var pubDir = __dirname + '/public'; 

// Configuration
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
	app.use(express.session({ secret: "my super secret string" }));
	app.use(express.compiler({ src: pubDir, enable: ['less']}));
    
    // Passport stuff
    app.use(passport.initialize());
    app.use(passport.session());
    
    app.use(app.router);
    app.use(express.static(pubDir));
});

app.dynamicHelpers({
	user: function(req, res) {
		// DEBUG
		console.log('User helper was called: ');
		
		return req.user;
	},
	isAuthenticated: function(req, res) {
		return req.isAuthenticated();
	}
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

// routes
routes.setup({
	app: app, 
	controllers: controllers, 
	passport: passport
});

// Start app
app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
