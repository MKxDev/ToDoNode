var TD = {};
TD.mod = {};

(function($) {
	TD.mod.Login = {
		duration: 350
		, init: function() {
			var self = this;
			
			$('.show-reg').click(function(ev) {
				self.showRegistration();
			});
			
			$('.show-login').click(function(ev) {
				self.showLogin();
			});
			
			$('.form-register').hide();
		}
		, showRegistration: function() {
			var self = this;
			
			$('.form-login').slideUp(self.duration, function() {
				$('.form-register').slideDown(self.duration);
			});
		}
		, showLogin: function() {
			var self = this;
			
			$('.form-register').slideUp(self.duration, function() {
				$('.form-login').slideDown(self.duration);
			});
		}
	};
})(jQuery);
