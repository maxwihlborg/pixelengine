define(function() {

	var instance = null;

	var TweenManager = Class.extend({

		init: function() {
			if (instance != null) {
				throw new Error("Cannot initate more than one TweenManager");
			}

			this.tweens = [];
		},

		add: function(tween) {
			this.tweens.push(tween);
		},

		update: function(dt) {
			for (var i = 0, len = this.tweens.length; i < len; i++) {
				if (this.tweens[i].update(dt)) {
					this.tweens.splice(i, 1);
					i--;
					len--;
				}
			}
		},
	});

	TweenManager.getInstance = function() {
		if (instance == null) {
			instance = new TweenManager();
		}
		return instance;
	}


	return TweenManager.getInstance();

});