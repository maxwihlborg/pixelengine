define([
	"pixelengine/utils/util",
	"pixelengine/utils/tmx-parser"
], function(util, TMXParser) {

	var TileMap = Class.extend({

		layers:   [],
		tilesets: [],

		xTiles: 0,
		yTiles: 0,

		width:  0,
		height: 0,

		tileWidth:  0,
		tileHeight: 0,

		_loadedimgs: 0,
		_canvas: null,
		_preloader: null,

		loaded: false,
		onload: null,

		isLoaded: function() {
			return this.loaded;
		},

		init: function(mapPath, tilesetPath, _loader) {
			this.tilesetPath = tilesetPath || "";
			
			this._preloader = _loader;

			if (typeof mapPath !== "string") {
				return this._initMap(mapPath);
			}

			var self = this;
			util.xhrGet(mapPath, function() {
				var d;
				switch (mapPath.split(".").pop()) {
					case "json":
						d = JSON.parse(this.responseText);
						break;
					case "tmx":
						d = TMXParser.parse(this.responseText);
						break;
				}
				self._initMap(d)
			});
		},

		draw: function(ctx, x, y, w, h) {

			if (!this.isLoaded()) return;

			if (this._canvas == null) {
				this._canvas = document.createElement("canvas");
				this._canvas.width = this.width;
				this._canvas.height = this.height;

				var _ctx = this._canvas.getContext("2d");

				var tw = this.tileWidth;
				var th = this.tileHeight;
				var mw = this.xTiles;

				for (var i = 0, len = this.layers.length; i < len; i++) {
					
					if (this.layers[i].type !== "tilelayer") continue;
					
					var d = this.layers[i].data;

					for (var id = 0, dlen = d.length; id < dlen; id++) {

						var _id = d[id];
						if (_id === 0) continue;

						var td = this._getTile(_id);

						var x = ((id % mw)|0) * tw;
						var y = ((id / mw)|0) * th;

						_ctx.drawImage(td.img, td.x, td.y, tw, th, x, y, tw, th);
					}
				}
			}

			if (x != null && y == null) {
				var c = x;

				x = c.position.x;
				y = c.position.y;
				w = c.width;
				h = c.height;

			} else {
				x = x || 0;
				y = y || 0;
				w = w || ctx.canvas.width;
				h = h || ctx.canvas.height;
			}

			ctx.drawImage(this._canvas, x, y, w, h, x, y, w, h);
		},

		_initMap: function(data) {
			var map = data, self = this;

			this.layers = data.layers;

			this.xTiles = map.width;
			this.yTiles = map.height;
			
			this.tileWidth = map.tilewidth;
			this.tileHeight = map.tileheight;

			this.width = this.xTiles * this.tileWidth;
			this.height = this.yTiles * this.tileHeight;

			var len = map.tilesets.length, incLoaded = function() {
				if (++self._loadedimgs === len) {
					self.loaded = true;
					if (self.onload != null) {
						self.onload();
					}
				}
			}

			for (var i = 0; i < len; i++) {

				var ts = map.tilesets[i];

				if (this.tilesetPath !== "") {
					ts.image = ts.image.replace(/^.*[\\\/]/, '');
				}

				var img;
				if (this._preloader != null) {
					img = this._preloader.get(ts.image);
					if (img == null) {
						img = this._preloader.loadImage(ts.image, this.tilesetPath + ts.image, incLoaded);
					} else {
						incLoaded();
					}
				} else {
					img = new Image();
					img.onload = incLoaded();
					img.src = ts.image;
				}

				this._addTileset(img, ts);
			}
		},

		_addTileset: function(img, data) {

			var ts = {
                firstgid: data.firstgid,

                img:       img,
                imgheight: data.imageheight,
                imgwidth:  data.imagewidth,
                name:      data.name,

                xtiles: (data.imagewidth / this.tileWidth)|0,
                ytiles: (data.imageheight / this.tileHeight)|0
			}

			this.tilesets.push(ts);
		},

		_getTile: function(id) {
			var tile = {
				img: null,
				x: 0,
				y: 0
			}

			var ts;
			for (var i = this.tilesets.length - 1; i >= 0; i--) {
				var ts = this.tilesets[i];
				if (ts.firstgid <= id) break;
			}

			id -= ts.firstgid;

			tile.img = ts.img;	
			tile.x = ((id % ts.xtiles)|0) * this.tileWidth;
			tile.y = ((id / ts.xtiles)|0) * this.tileHeight;

			return tile;
		}
	});


	return TileMap;

});