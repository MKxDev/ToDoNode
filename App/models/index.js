function models(params) {
	var mongoose = params.mongoose;
	var utils = params.utils;
	
    console.log('Initializing models. Mongoose: ' + mongoose);
    
    var	Schema = mongoose.Schema,
    	ObjectId = mongoose.Schema.ObjectId;
    	
	/* Schema Definition */
	var UserSchema = new Schema({
		email: { type: String, required: true, index: {unique: true}},
		passwordHash: String,
		salt: String,
		date: { type: Date, default: Date.now }
	});
	UserSchema.methods.authenticate = function authenticate(password, cb) {
		var self = this;
		var hash = utils.getHash(password, self.salt);
		
		cb(hash == self.passwordHash);
	};
	
	
	var TodoItemSchema = new Schema({
		name: { type: String, required: true },
		date: { type: Date, default: Date.now },
		isComplete: { type: Boolean, default: false },
		list: { type: ObjectId, request: true }
	});
	
	
	var ListSchema = new Schema({
		name: { type: String, required: true },
		date: { type: Date, default: Date.now },
		user: { type: ObjectId,  required: true, ref: 'User' },
		tasks: [ TodoItemSchema ]
	});
	
	/* Add models */
	mongoose.model('User', UserSchema);
	mongoose.model('TodoItem', TodoItemSchema);
	mongoose.model('List', ListSchema);
};

module.exports = models;