var crypto = require('crypto');
var utils = {
	getRandom: function(min, max) {
		var rnd = Math.floor(Math.random() * (max - min) + min);
		
		return rnd;
	},
	generateString: function(length) {
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
	
	    for(var i=0; i < length; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
		
		return text;
	},
	getHash: function(value, salt) {
		var md5 = crypto.createHash('md5');
		
		md5.update(value.toString() + salt.toString());
		
		var hash = md5.digest('base64');
		
		return hash;
	}
};

module.exports = utils;