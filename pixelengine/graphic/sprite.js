define(function() {

	var Sprite = Class.extend({

		init: function(img, x, y, width, height, ox, oy) {
			this.img = img;
			this.x = x;
			this.y = y;
			this.width  = width;
			this.height = height;

			this.ox = ox || 0;
			this.oy = oy || 0;
		},

		bbox: function() {
			return new Rect(this.width, this.height);
		},

		draw: function(ctx, x, y) {
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height, x+ox, y+oy, this.width, this.height);
		}
	});


	return Sprite;
});