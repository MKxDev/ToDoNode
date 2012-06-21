function controllers(params) {
    var providers = params.providers;
    var passport = params.passport;
    var sessions = require('sessions');

    controllers.index = function(req, res) {
    	var user = req.user;
        var listProvider = new providers.ListProvider();
        
        listProvider.findAll({userId: user._id, count: 10}, function(err, lists) {
            res.render('index', {
            	title: 'ToDoNode!', 
            	lists: lists, 
            	errorMessage: err});
        });
    }

    controllers.newList = function(req, res) {
        res.render('addNewList', { title: 'Add New List' });
    };

    controllers.addList = function(req, res) {
    	var user = req.user;
        var listReq = req.body;
        
        var listProvider = new providers.ListProvider();
        listProvider.addList({
        	userId: user._id, 
        	name: listReq.ListName
    	}, function(err, list) {
            if (err) {
            	// TODO: Display the error            	
                res.redirect('/lists/add');
            }
            else {
            	res.redirect('/lists/' + list._id);            	
            }
        });
    };

    controllers.addTask = function(req, res) {
        var todoRequest = req.body;

        var listProvider = new providers.ListProvider();

        listProvider.addTodo({
        	listId: req.body._id,
        	name: req.body.TodoItem
    	}, function(err, list) {
            res.redirect('/lists/' + list._id);
        });
    };

    controllers.viewList = function(req, res) {
        var listProvider = new providers.ListProvider();
        var id = req.params.id;

        listProvider.findById(id, function(err, list) {
            if (err) res.redirect('/lists/' + id);

            res.render('list', { title: list.name, list: list });
        });
    };
    
    controllers.getLogin = function(req, res) {                
    	var returnUrl = req.query.returnUrl || '';
    	
    	res.render('login', {
    		title: 'Welcome to ToDo Node!', 
    		returnUrl: encodeURIComponent(returnUrl),
    		errorMessage: req.flash('error')
		});
    };

    controllers.postLogin = function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) {
                req.flash('error', info.message);
                return res.redirect('/');
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                var retUrl = req.query.returnUrl || '/';
                return res.redirect(retUrl);
            });
        })(req, res, next);
    };
    
    controllers.register = function(req, res) {
    	var userProvider = new providers.UserProvider();
    	
    	// TODO: Move this to a validation module
    	if (!req.body.newEmail) {
    		req.flash('error', 'Please enter a valid email address');
    		
    		res.redirect('/login');
    		return;
    	}
    	if (!req.body.newPassword) {
    		req.flash('error', 'Password is required');
    		
    		res.redirect('/login');
    		return;
    	}
    	if (req.body.newPassword != req.body.newPassword2) {
    		req.flash('error', 'Please enter matching passwords');
    		
    		res.redirect('/login');
    		return;
    	}
    	// END TODO: Move this to a validation module
    	
    	userProvider.addUser(req.body.newEmail, req.body.newPassword, function(err, user) {
    		if (err) {
    			req.flash('error', err);
    			
    			res.redirect('/login');
    		} else {
    			// Authenticate the user after registration
    			req.logIn(user, function(err) {
    				var retUrl = req.query.returnUrl || '/';
	                return res.redirect(retUrl);
	            });
    		}
    	});
    };

    return controllers;
};

module.exports = controllers;