define(function() {

	var Rect = Class.extend({

		init: function(x, y, width, height) {
			var t = arguments.length > 2;
			this.x = t ? x : 0;
			this.y = t ? y : 0;
			this.width = t ? width : x;
			this.height = t ? height : y;
		},

		intersect: function(other) {
			var ax = this.x,
				ay = this.y,
				aw = this.width,
				ah = this.height,

				bx = other.x,
				by = other.y,
				bw = other.width,
				bh = other.height;

			return ax < bx+bw && ay < by+bh && bx < ax+aw && by < ay+ah;
		}
	});


	return Rect;

});