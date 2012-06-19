var TD = {};
TD.mod = {};

(function($) {
	TD.mod.Login = {
		duration: 250
		, init: function() {
			// DEBUG
			console.log('Initting Login!');
			var self = this;
			
			$('.show-reg').click(function(ev) {
				self.showRegistration();
			});
			
			$('.show-login').click(function(ev) {
				self.showLogin();
			});
		}
		, showRegistration: function() {
			var self = this;
			
			$('.form-login').animate({
				height: 'toggle'
			}, self.duration, 'linear');
			
			$('.form-register').animate({
				height: 'toggle'
			}, self.duration, 'linear');
			
			// $('.form-login').hide(self.duration);
			// $('.form-register').show(self.duration);
		}
		, showLogin: function() {
			var self = this;
			
			$('.form-login').animate({
				height: 'toggle'
			}, self.duration, 'linear');
			
			$('.form-register').animate({
				height: 'toggle'
			}, self.duration, 'linear');
		}
	};
})(jQuery);
