define([
	"pixelengine/utils/math/math"
], function(math) {

	var Vec2 = Class.extend({

		init: function(x, y) {
	    	this.x = x || 0;
	    	this.y = y || 0;
	    },

		set: function() {
			if (arguments.length === 1) {
				this.x = arguments[0].x;
				this.y = arguments[0].y;
			} else {
				this.x = arguments[0];
				this.y = arguments[1];
			}
		},
		setp: function(x, y) {
			this.x = x;
			this.y = y;
		},
		setv: function(v) {
			this.x = v.x;
			this.y = v.y;
		},

		clone: function() {
			return new Vec2(this.x, this.y);
		},

		add: function() {
			if (arguments.length === 1) {
				this.x += arguments[0].x;
				this.y += arguments[0].y;
			} else {
				this.x += arguments[0];
				this.y += arguments[1];
			}
			return this;
		},
		addp: function(x, y) {
			this.x += x; this.y += y;
			return this;
		},
		addv: function(v) {
			this.x += v.x; this.y += v.y;
			return this;
		},

		sub: function() {
			if (arguments.length === 1) {
				this.x -= arguments[0].x;
				this.y -= arguments[0].y;
			} else {
				this.x -= arguments[0];
				this.y -= arguments[1];
			}
			return this;
		},
		subp: function(x, y) {
			this.x -= x; this.y -= y;
			return this;
		},
		subv: function(v) {
			this.x -= v.x; this.y -= v.y;
			return this;
		},

		rotate: function(theta) {
			var c = math.cos(theta);
			var s = math.sin(theta);
			var _x = this.x;
			var _y = this.y;

			this.x = c*_x - s*_y;
			this.y = s*_x + c*_y;
			return this;
		},

		angle: function() {
			return Math.atan2(this.y, this.x)*math.TODEG;
		},

		len: function(x, y) {
			if (x == null || y == null) {
				return Math.sqrt(this.x*this.x + this.y*this.y);
			}
			return Math.sqrt(x*x + y*y);
		},

		len2: function(x, y) {
			if (x == null || y == null) {
				return this.x*this.x + this.y*this.y;
			}
			return x*x + y*y;
		},

		isZero: function() {
			return this.x*this.x + this.y*this.y === 0;
		},

		nor: function() {
			var l = this.x*this.x + this.y*this.y;
			if (l === 0) return this;
			l = 1/Math.sqrt(l);
			this.x *= l;
			this.y *= l;
			return this;
		},

		scl: function(c) {
			this.x *= c;
			this.y *= c;
			return this;
		},

		dot: function() {
			if (arguments.length === 1) {
				return this.x*arguments[0].x + this.y*arguments[0].y;
			}
			return this.x*arguments[0] + this.y*arguments[1];
		},

		crs: function() {
			if (arguments.length === 1) {
				return this.x*arguments[0].y - this.y*arguments[0].x;
			}
			return this.x*arguments[1] - this.y*arguments[0];
		},

		clamp: function(min, max) {
			var l = math.clamp(Math.sqrt(this.x*this.x + this.y*this.y), min, max);
			return this.nor().scl(l);
		},

		toString: function() {
			return "VECTOR: ("+this.x+", "+this.y+"), len: "+this.len()+"";
		}
	});

	
	return Vec2;

});