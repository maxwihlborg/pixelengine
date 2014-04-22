define([
	"pixelengine/utils/math/math",
	"pixelengine/utils/math/vec2",
	"pixelengine/utils/math/rect"
], function(math, Vec2, Rect) {

	var SAVED = 0, RESTORED = 1;

	var Camera = Class.extend({

		init: function(canvas) {
			this.canvas = canvas;

			this.width  = canvas.width;
			this.height = canvas.height;

			this.position = new Vec2();
			this._following = null;

			this.width2  = (this.width*0.5)|0;
			this.height2 = (this.height*0.5)|0;

			this.bounds = new Rect(0, 0);

			this.center = new Vec2(this.width2, this.height2);

			this._state = RESTORED;
		},

		setBounds: function() {
			if (arguments.length === 1) {
				this.bounds = arguments[0];
			} else if (arguments.length === 2) {
				this.bounds = new Rect(arguments[0], arguments[1]);
			} else {
				this.bounds = new Rect(arguments[0], arguments[1], arguments[2], arguments[3]);
			}
			this.bounds.width -= this.width;
			this.bounds.height -= this.height;
		},
		getBounds: function() {
			return this.bounds;
		},

		follow: function(pos) {
			this._following = pos;
		},

		unFollow: function() {
			this._following = null;
		},

		translate: function() {
			var x, y;
			if (arguments.length === 1) {
				x = arguments[0].x;
				y = arguments[0].y;
			} else {
				x = arguments[0];
				y = arguments[1];
			}

			x += this.position.x;
			y += this.position.y;

			x = math.clamp(x, this.bounds.x, this.bounds.width);
			y = math.clamp(y, this.bounds.y, this.bounds.height);

			this.position.setp(x, y);
			this.center.setp(x + this.width2, y + this.height2);
		},

		set: function() {
			if (this._state === SAVED) {
				throw new Error("Use both set and restore methods on Camera!")
			}
			if (this._following != null) {
				var x = this._following.x - this.center.x;
				var y = this._following.y - this.center.y;

				x |= 0;
				y |= 0;
			}

			this.translate(x, y);
			
			this._state = SAVED;
			this.canvas.ctx.save();
			this.canvas.ctx.translate(-this.position.x, -this.position.y);	
		},

		restore: function() {
			this._state = RESTORED;
			this.canvas.ctx.restore();
		},

		translateToCanvas: function(v, clone) {
			v = clone === true ? v.clone() : v;
			var s = this.canvas.scale;
			var ww = ((window.innerWidth - this.width*s)*0.5)|0;
			var wh = ((window.innerHeight - this.height*s)*0.5)|0;

			v.subp(ww, wh).scl(1/s).addv(this.position);
			v.x |= 0;
			v.y |= 0;
			return v;
		},

		setSound2D: function(sound, pos, _basevol) {

			var scrDist = pos.clone().subv(this.center).scl(1/this.width2);

			var fade = math.clamp(2 - scrDist.len(), 0, 1);
			var basevol = _basevol || 1;

			sound.setVolume(fade*fade*basevol);
			sound.setPan(math.clamp(scrDist.x, -1, 1));

			return fade > 0;
		}
	});


	return Camera;

});