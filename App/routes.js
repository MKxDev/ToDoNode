exports.setup = function(params) {
    var app = params.app;
    var controllers = params.controllers;
    var passport = params.passport;

    // Routes
    app.get('/', authorize, controllers.index);
    app.get('/lists/add', authorize, controllers.newList);
    app.post('/lists/add', authorize, controllers.addList);
    app.get('/lists/:id', authorize, controllers.viewList);
    app.post('/lists/new-task', authorize, controllers.addTask);
    
    app.get('/login', deauth, controllers.getLogin);
    app.post('/login', deauth, controllers.postLogin);
    app.get('/logout', deauth, function(req, res) {
    	res.redirect('/login');
    });
    
    app.post('/register', deauth, controllers.register);
    
    function deauth(req, res, next) {
    	if (req.isAuthenticated()) {
    		req.logOut();
    	}
    	
    	next();
    };
    
    function authorize(req, res, next) {
    	if (!req.isAuthenticated()) {
    		var returnUrl = (req.route.path != '/' ? req.route.path : '');
            res.redirect('/login' + (returnUrl ? '?returnUrl=' + encodeURIComponent(req.route.path) : ''));
            return;
        }
        
        next();
        return;
    };
};
