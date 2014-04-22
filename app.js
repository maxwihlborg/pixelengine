define([
	"pixelengine/game",
	"pixelengine/graphic/canvas"
], function(Game, Canvas) {

	var App = Game.extend({

		init: function() {
			this.canvas = new Canvas(320, 180);
			this.canvas.setScale(3);
		},

		tick: function(dt) {
			this.canvas.ctx.clearAll();

			this.canvas.flip();
		}
	});


	return App;

});