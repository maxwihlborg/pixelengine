define(function() {

	var Canvas = Class.extend({

		init: function(width, height, view, scale) {
			this.width = width || 640;
			this.height = height || 360;

			append = view == null;
			view = append ? document.createElement("canvas") : view;
			scale = scale != null ? scale : true;

			if (scale) {
				this.canvas = document.createElement("canvas");
				this.renderCanvas = view;
				this.setScale();
			} else {
				this.canvas = view;
				this.flip = function() {};
			}

			this.canvas.width = this.width;
			this.canvas.height = this.height;

			this.ctx = this.canvas.getContext("2d");

			this.ctx.clearAll = function(color) {
				var c = color || "#fff";
				this.save();
				this.fillStyle = c;
				this.fillRect(0, 0, this.canvas.width, this.canvas.height);
				this.restore();
			}

			if (append) {
				document.body.appendChild(scale ? this.renderCanvas : this.canvas);
			}
		},

		setScale: function(scale) {
			var s;
			if (scale != null) {
				s = scale;
			} else {
				var xs = Math.floor(window.innerWidth/this.width);
				var ys = Math.floor(window.innerHeight/this.height);
				s = Math.min(xs, ys);
				s = Math.max(s, 1);
			}

			this.scale = s;

			var w = this.renderCanvas.width = s*this.width;
			var h = this.renderCanvas.height = s*this.height;

			var rctx = this.renderCanvas.getContext("2d");

			rctx['imageSmoothingEnabled']       = false;
			rctx['mozImageSmoothingEnabled']    = false;
			rctx['oImageSmoothingEnabled']      = false;
			rctx['webkitImageSmoothingEnabled'] = false;
			rctx['msImageSmoothingEnabled']     = false;

			var c = this.canvas;

			this.flip = function() {
				rctx.drawImage(c, 0, 0, w, h);
			}
		}
	});


	return Canvas;

});