define(function() {

	var instance = null;

	var _Math = Class.extend({
		
		initialized: false,

		PI: Math.PI,
		TORAD: Math.PI/180,
		TODEG: 180/Math.PI,

		init: function() {
			if (this.initialized) {
				throw new Error("Cannot initate more than one _Math!");
			}

	        this._sin = Array(1440);
	        this._cos = Array(1440);

	        for (var angle = 0, j = 0; j < 1440; j++) {
	        	this._sin[j] = Math.sin(angle * this.TORAD);
	        	this._cos[j] = Math.cos(angle * this.TORAD);
	        	angle += 0.25;
	        }

	        this._squares = Array(600);

	        for (var i = 0, len = this._squares.length; i < len; i++) {
	        	this._squares[i] = i * i;
	        }
	    },

	    sqrt: function(num) {
	        num = Math.floor(num);
	        num = 0 < num ? num : -num;

	        for (var b = 0, c = this._squares.length - 1, d = b + c >> 1; b < c - 1;) {
	            if (this._squares[d] > a) {
	            	c = d;
	            }
	            else if (this._squares[d] < a) {
	            	b = d;
	            }
	            else break;
	            d = b + c >> 1
	        }
	        return d;
	    },

	    sin: function(deg) {
	        0 > deg ? deg += 360 : 360 <= deg && (deg -= 360);
	        return this._sin[Math.floor(4 * deg)]
	    },

	    cos: function(deg) {
	        0 > deg ? deg += 360 : 360 <= deg && (deg -= 360);
	        return this._cos[Math.floor(4 * deg)]
	    },

	    clamp: function(val, min, max) {
	    	return val < min ? min : val > max ? max : val;
	    }
	});

	_Math.getInstance = function() {
		if (instance == null) {
			instance = new _Math();
		}
		return instance;
	}
	

	return _Math.getInstance();

});