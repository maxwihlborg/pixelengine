define([
	"pixelengine/utils/util"
], function(util) {

	var instance = null;

	var TextureUnpacker = Class.extend({

		init: function() {
			if (instance != null) {
				throw new Error("Cannot initate more than one TextureUnpacker!");
			}
		},

		unpack: function(path, _aspath, callback, _preloader) {
			var self = this;
			_aspath = _aspath || "";
			_preloader = _preloader || callback;

			util.xhrGet(path, function() {
				var data = JSON.parse(this.responseText);

				var img = _preloader.get(data.meta.image);
				if (img == null) {
					img = _preloader.loadImage(data.meta.image, _aspath+data.meta.image, function() {
						self._cut(img, data, callback, _preloader);
					});
				} else {
					self._cut(img, data, callback, _preloader);
				}
			});
		},

		_cut: function(img, data, cb, _preloader) {

			var c = document.createElement("canvas");
			var ctx = c.getContext("2d");

			function _add(n, d) {
				var f = d.frame;
				var s = d.spriteSourceSize;
				var ss = d.sourceSize;

				c.width  = ss.w;
				c.height = ss.h;

				ctx.drawImage(img, f.x, f.y, f.w, f.h, s.x, s.y, s.w, s.h);

				var i = new Image();
				i.src = c.toDataURL();
				_preloader.files[n] = i;
			}

			if (data.frames instanceof Array) {
				for (var i = 0, len = data.frames.length; i < len; i++) {
					var f = data.frames[i];
					_add(f.filename, f);
				}
			} else {
				for (var f in data.frames) {
					_add(f, data.frames[f]);
				}
			}

			if (cb != null && cb !== _preloader) {
				cb();
			}
		}
	});

	TextureUnpacker.getInstance = function() {
		if (instance === null) {
			instance = new TextureUnpacker();
		}
		return instance;
	}


	return TextureUnpacker.getInstance();

});