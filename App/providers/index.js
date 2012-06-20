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
        	if (!request.userId) cb('Please specify a proper user');
        	request.count = request.count || 10;
        	
        	List
        		.where({user: request.userId})
        		.limit(request.count)
        		.exec(cb);
        },
        findById: function(id, cb) {
        	if (!id) cb('Please specify a proper identifier');
        	
            var oId = ObjectId(id);
            List
            	.findOne()
            	.where({'_id': oId})
            	.exec(cb);
        },
        addList: function(request, cb) {
        	if (!request.userId) cb('Please specify a proper user');
        	
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
        	this.findByEmail(email, function(err, user) {
        		if (user) {
        			cb('A user with this email already exists.');
        		}
        		else {
        			var salt = utils.generateString(15);
        			var passwordHash = utils.getHash(password, salt);
        			
        			var user = new User({ 
        				email: email,
        				passwordHash: passwordHash,
        				salt: salt });
        			
        			user.save(function(err) {
        				cb(err, user);
        			});
        		}
        	});
        },
        findById: function(id, callback) {
            var oId = ObjectId(id);
            User.find({'_id': oId}, callback);
        },
        findByEmail: function(email, cb) {
            User.findOne({email: email}, cb);
        }
    };

    return providers;
};

module.exports = providers;