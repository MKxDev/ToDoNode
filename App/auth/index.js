function auth(params) {
    // DEBUG
    console.log('Initializing passport');

    var providers = params.providers;
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    var userProvider = new providers.UserProvider();

    passport.serializeUser(function(user, cb) {
        cb(null, user._id);
    });

    passport.deserializeUser(function(id, cb) {
        userProvider.findById(id, cb);
    });

    passport.use(new LocalStrategy(
        function(email, password, done) {
            // DEBUG
            console.log('*** Using LocalStrategy to auth');

            // asynchronous verification, for effect...
            process.nextTick(function () {
                // Find the user by username.  If there is no user with the given
                // username, or the password is not correct, set the user to `false` to
                // indicate failure and set a flash message.  Otherwise, return the
                // authenticated `user`.
                userProvider.findByEmail(email, function(err, user) {
                    if (err) { return done(err); }
                    if (!user) { return done(null, false, { message: 'Unkown user ' + email }); }
                    
                    user.authenticate(password, function(auth) {
                    	// DEBUG
	                	console.log('Authed: ', auth);
                    	
	                    if (!auth) {
	                    	return done(null, false, { message: 'Invalid password' });
	                	}
	                    	
	                	return done(null, user);
                    });
                    
                    // if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
                });
            });
        }
    ));

    return passport;
};

module.exports = auth;