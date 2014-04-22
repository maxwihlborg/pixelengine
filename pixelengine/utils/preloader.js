define([
	"pixelengine/utils/util",
	"pixelengine/utils/texture-unpacker",
	"pixelengine/world/tilemap",
	"pixelengine/sound/sound"
], function(util, TU, TileMap, Sound) {

	var instance = null;

	var PreLoader = Class.extend({

		files: {},
		pending: 0,
		loaded: 0,

		init: function() {
			if (instance != null) {
				throw new Error("Cannot initate more than one PreLoader!");
			}

			var self = this;
			Sound.setListener(function(sound, state) {
				if (state === Sound.State.LOADED) {
					if (sound.onload != null) {
						sound.onload();
					}
				}
				else if( state === Sound.State.ERROR ) {
					console.error("Sound error: " + sound.getPath());
				}
			});
		},

		progress: function() {
			return (this.loaded + 1) / (this.loaded + this.pending + 1);
		},

		load: function(files, _path, _path2) {
			if (_path != null) {
				if (this.files[files] != null) {
					return this.files[files];
				}
				files = [files, _path];
				if (_path2 != null) files.push(_path2);
			}
			files = files[0] instanceof Array ? files : [files];
			for (var i = 0, len = files.length; i < len; i++) {
				var file = files[i];
				var name = file[0];
				var path = file[1];

				switch (path.split(".").pop()) {
					case "png":
					case "jpg":
					case "gif":
						this.loadImage(name, path, null);
						break;

					case "ogg":
					case "mp3":
					case "wav":
						this.loadSound(name, path, null);
						break;

					case "json":
					case "tmx":
						var _aspath = file.length > 2 ? file[2] : "";
						this.loadTileMap(name, path, _aspath, null);
						break;

					default:
						this.unpack(name, path);
						break;
				}
			}
			Sound.load();
			if (_path != null) {
				return this.files[files[0][0]];
			}
		},

		unpack: function(path, _aspath, callback) {
			this.pending++;

			var self = this;
			var cb = function() {
				self.loaded++;
				self.pending--;
				if (callback != null) {
					callback.call(this);
				}
			}

			TU.unpack(path, _aspath, cb, this);
		},

		loadImage: function(name, path, callback) {
			this.pending++;

			var img = new Image();

			var self = this;
			img.onload = function() {
				self.loaded++;
				self.pending--;
				if (callback != null) {
					callback.call(this);
				}
			}
			img.src = path;

			return this.files[name] = img;
		},

		loadSound: function(name, path, callback) {
			this.pending++;

			var sound = this.files[name] = new Sound(path);
			
			var self = this;
			sound.onload = function() {
				self.loaded++;
				self.pending--;
				if (callback != null) {
					callback.call(this);
				}
			}
			Sound.load();

			return sound;
		},

		loadTileMap: function(name, path, _aspathload, _callback) {
			this.pending++;

			var aspath = typeof _aspathload === "string" ? _aspathload : "";
			var callback = typeof _aspathload === "string" ? _callback : _aspathload;
			
			var map = new TileMap(path, aspath, this);

			var self = this;
			map.onload = function() {
				self.loaded++;
				self.pending--;
				if (callback != null) {
					callback.call(this);
				}
			}

			return this.files[name] = map;
		},

		get: function(name) {
			return this.files[name];
		}
	});

	PreLoader.getInstance = function() {
		if (instance === null) {
			instance = new PreLoader();
		}
		return instance;
	}


	return PreLoader.getInstance();

});