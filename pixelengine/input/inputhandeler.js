define([
	"pixelengine/utils/math/vec2"
], function(Vec2) {

	var Keys = {
		"enter": 19,
		"space": 32,

		"left arrow":  37,
		"up arrow":    38,
		"right arrow": 39,
		"down arrow":  40
	}

	var InputHandeler = Class.extend({

		_bindings: {},
		_pressed:  [],
		_down:     [],
		_keyLen:  256,

		mouse: new Vec2(0, 0),

		init: function(keys) {

			if (keys != null) {
				for (var action in keys) {
					this.bindAction(action, keys[action]);
				}
			}
			for (var i = 0; i < this._keyLen; i++) {
				this._pressed.push(false);
				this._down.push(false);
			}

			this.mouse._down = false;
			this.mouse._pressed = false;

			document.addEventListener("keydown",   this._onKeyDown.bind(this),   false);
			document.addEventListener("keyup",     this._onKeyUp.bind(this),     false);
			document.addEventListener("mousemove", this._onMouseMove.bind(this), false);
			document.addEventListener("mousedown", this._onMouseDown.bind(this), false);
			document.addEventListener("mouseup",   this._onMouseUp.bind(this),   false);
		},

		bindAction: function(action, key) {

			var c = this._getCode(key);

			if (c == null || 0 > c || c > this._keyLen) {
				throw new Error("Bad attempted keybinding: "+action+", "+key+"!");
			}

			this._bindings[action] = c;
			this._pressed[c] = false;
			this._down[c] = false;

		},

		isDown: function(action) {
			var c = this._bindings[action];
			if (c == null) throw new Error("Bad inputaction: "+action+"!");
			return this._down[c];
		},

		isPressed: function(action) {
			var c = this._bindings[action];
			if (c == null) throw new Error("Bad inputaction: "+action+"!");

			if (this._pressed[c] || !this._down[c]) {
				return false;
			}
			return this._pressed[c] = true;
		},

		mouseDown: function() {
			return this.mouse._down;
		},

		mousePressed: function() {
			if (this.mouse._pressed || !this.mouse._down) {
				return false;
			}
			return this.mouse._pressed = true;
		},

		_getCode: function(c) {
			if (typeof c === "number") {
				return c;
			} else if (c.length > 1) {
				return Keys[c];
			}
			return c.toUpperCase().charCodeAt(0);
		},

		_onKeyDown: function(evt) {
			var c = evt.keyCode;
			if (c > this._keyLen) return;
			this._down[c] = true;
		},

		_onKeyUp: function(evt) {
			var c = evt.keyCode;
			if (c > this._keyLen) return;
			this._pressed[c] = false;
			this._down[c] = false;
		},

		_onMouseMove: function(evt) {
			this.mouse.x = evt.clientX;
			this.mouse.y = evt.clientY;
		},

		_onMouseDown: function() {
			this.mouse._down = true;
		},

		_onMouseUp: function() {
			this.mouse._pressed = false;
			this.mouse._down = false;
		}
	});


	return InputHandeler;

});