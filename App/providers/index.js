function providers(params) {
    console.log('Initializing providers');
    
    var models = params.models;
    var mongoose = params.mongoose;
    var utils = params.utils;
    var User = mongoose.model('User');
    var List = mongoose.model('List');
    var TodoItem = mongoose.model('TodoItem');
    var ObjectId = mongoose.Types.ObjectId;

    providers.ListProvider = function() {
        this.init();
    };
    providers.ListProvider.prototype = {
        init: function() {},
        findAll: function(request, cb) {
        	List
        		.where({user: request.userId})
        		.limit(request.count)
        		.exec(cb);
        },
        findById: function(id, cb) {
            var oId = ObjectId(id);
            List
            	.findOne()
            	.where({'_id': oId})
            	.exec(cb);
        },
        addList: function(request, cb) {
        	var list = new List({
        		user: ObjectId(request.userId),
        		name: request.name,
        		tasks: []
        	});
        	
        	list.save(function(err) {
        		cb(err, list);
        	});
        },
        addTodo: function(request, cb) {
        	this.findById(request._id, function(err, list) {
        		var task = new TodoItem({
        			name: request.name,
        			list: request._id
        		});
        		
        		list.tasks.push(task);
        		
        		list.save(cb); 
        	});
        }
    };

    providers.UserProvider = function() {};
    providers.UserProvider.prototype = {
        addUser: function(email, password, cb) {
        	// debug
        	console.log('Adding new user: ', email);
        	
        	this.findByEmail(email, function(err, user) {
        		if (user) {
        			cb('A user with this email already exists.');
        		}
        		else {
        			var salt = utils.generateString(15);
        			var passwordHash = utils.getHash(password, salt);
        			
        			// DEBUG
        			console.log('Adding new user:');
        			console.log('\tEmail: ', email);
        			console.log('\tPassword: ', password);
        			console.log('\tHash: ', passwordHash);
        			
        			var user = new User({ 
        				email: email,
        				passwordHash: passwordHash,
        				salt: salt });
        			
        			user.save(function(err) {
        				// DEBUG
        				console.log('Added user successfully: ', user.email);
        				
        				cb(err, user);
        			});
        		}
        	});
        },
        findById: function(id, callback) {
            // DEBUG
            console.log('Retrieving user by ID: ', id);
            
            var oId = ObjectId(id);
            User.find({'_id': oId}, callback);
        },
        findByEmail: function(email, cb) {
            // DEBUG
            console.log('Retrieving by email: ', email);
            
            User.findOne({email: email}, cb);
        }
    };

    return providers;
};

module.exports = providers;