define(function() {

	var Game = Class.extend({

		currentScene: null,
		_nextScene: 0,

		run: function() {

			var rAF = (function() {
				return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame  ||
				window.mozRequestAnimationFrame     ||
				window.oRequestAnimationFrame       ||
				window.msRequestAnimationFrame
			})();

			var self = this, prevtime = 0, NO_CHANGE = 0;
			var loop = function(time) {

				var now = time;
				var dt = Math.min(now - prevtime, 50);
				prevtime = now;

				if (self._nextScene !== NO_CHANGE) {
					self.setScene(self._nextScene);
					self._nextScene = NO_CHANGE;
				}

				self.tick(dt);

				rAF(loop);
			}
			rAF(loop);
		},

		changeScene: function(sceneClass) {
			this._nextScene = sceneClass;
		},

		setScene: function(sceneClass) {
			if (this.currentScene != null) {
				this.currentScene.destroy();
			}
			this.currentScene = new sceneClass(this);
		},

		getScene: function() {
			return this.currentScene;
		},

		tick: function(dt) {
			throw new Error("Tickfunction not implemented in Game subclass.")
		}

	});


	return Game;

});