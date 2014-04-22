define([
	"pixelengine/graphic/animation/tweenmanager"
], function(TweenManager) {

	var funcIDs = {
		NONE:         0,
		LINEAR:       0,
		QUAD_IN:      1,
		QUAD_OUT:     2,
		QUAD_INOUT:   3,
		CUBE_IN:      4,
		CUBE_OUT:     5,
		CUBE_INOUT:   6,
		QUART_IN:     7,
		QUART_OUT:    8,
		QUART_INOUT:  9,
		QUINT_IN:     10,
		QUINT_OUT:    11,
		QUINT_INOUT:  12,
		SIN_IN:       13,
		SIN_OUT:      14,
		SIN_INOUT:    15,
		BOUNCE_IN:    16,
		BOUNCE_OUT:   17,
		BOUNCE_INOUT: 18,
		CIRC_IN:      19,
		CIRC_OUT:     20,
		CIRC_INOUT:   21,
	},

    PI = 3.1415926,
    PI2 = 1.5707963,
    B1 = 0.363636363636364,
    B2 = 0.727272727272727,
    B3 = 0.545454545454545,
    B4 = 0.909090909090909,
    B5 = 0.818181818181818,
    B6 = 0.954545;

	var Tween = Class.extend({

		init: function(object) {
			TweenManager.add(this);

			this._functionId = funcIDs.NONE;
			this._object = object;
			this._timer = 0;
			this._tweens = [];
			this._active = null;
		},

		interpolate: function(a) {
			switch (this._functionId) {
				case funcIDs.QUAD_IN:
					a *= a;
					break;
				case funcIDs.QUAD_OUT:
					a = -a*(a - 2);
					break;
				case funcIDs.QUAD_INOUT:
					a = 0.5 >= a ? 2*a*a : 1 - 2*--a*a;
					break;
				case funcIDs.CUBE_IN:
					a *= a*a;
					break;
				case funcIDs.CUBE_OUT:
					a = 1 + --a*a*a;
					break;
				case funcIDs.CUBE_INOUT:
					a = 0.5 >= a ? 4*a*a*a : 1 + 4*--a*a*a;
					break;
				case funcIDs.QUART_IN:
					a *= a*a*a;
					break;
				case funcIDs.QUART_OUT:
					a = 1 - (a -= 1)*a*a*a;
					break;
				case funcIDs.QUART_INOUT:
					a = 0.5 >= a ? 8*a*a*a*a : (1 - (a = 2*a - 2)*a*a*a)/2 + 0.5;
					break;
				case funcIDs.QUINT_IN:
					a *= a*a*a*a;
					break;
				case funcIDs.QUINT_OUT:
					a = (a -= 1)*a*a*a*a + 1;
					break;
				case funcIDs.QUINT_INOUT:
					a = 1 > (a *= 2) ? a*a*a*a*a/2 : ((a -= 2)*a*a*a*a + 2)/2;
					break;
				case funcIDs.SIN_IN:
					a = -Math.cos(PI2*a) + 1;
					break;
				case funcIDs.SIN_OUT:
					a = Math.sin(PI2*a);
					break;
				case funcIDs.SIN_INOUT:
					a = -Math.cos(PI*a)/2 + 0.5;
					break;
				case funcIDs.BOUNCE_IN:
					a = 1 - a;
					if (a < B1) {
						a = 1 - 7.5625*a*a;
						break
					}
					if (a < B2) {
						a = 1 - (7.5625*(a - B3)*(a - B3) + 0.75);
						break
					}
					if (a < B4) {
						a = 1 - (7.5625*(a - B5)*(a - B5) + 0.9375);
						break
					}
					a = 1 - (7.5625*(a - B6)*(a - B6) + 0.984375);
					break;
				case funcIDs.BOUNCE_OUT:
					if (a < B1) {
						a *= 7.5625*a;
						break
					}
					if (a < B2) {
						a = 7.5625*(a - B3)*(a - B3) + 0.75;
						break
					}
					if (a < B4) {
						a = 7.5625*(a - B5)*(a - B5) + 0.9375;
						break
					}
					a = 7.5625*(a - B6)*(a - B6) + 0.984375;
					break;
				case funcIDs.BOUNCE_INOUT:
					if (0.5 > a) {
						a = 1 - 2*a;
						if (a < B1) {
							a = (1 - 7.5625*a*a)/2;
							break
						}
						if (a < B2) {
							a = (1 - (7.5625*(a - B3)*(a - B3) + 0.75))/2;
							break
						}
						if (a < B4) {
							a = (1 - (7.5625*(a - B5)*(a - B5) + 0.9375))/2;
							break
						}
						a = (1 - (7.5625*(a - B6)*(a - B6) + 0.984375))/2;
						break
					}
					a =
						2*a - 1;
					if (a < B1) {
						a = 7.5625*a*a/2 + 0.5;
						break
					}
					if (a < B2) {
						a = (7.5625*(a - B3)*(a - B3) + 0.75)/2 + 0.5;
						break
					}
					if (a < B4) {
						a = (7.5625*(a - B5)*(a - B5) + 0.9375)/2 + 0.5;
						break
					}
					a = (7.5625*(a - B6)*(a - B6) + 0.984375)/2 + 0.5;
					break;
			}
			return a;
		},

		update: function(dt) {
			var end = false;

			if (this._active == null) {
				if (this._tweens.length > 0) {
					this._active = this._tweens.pop();
				} else {
					return end = true;
				}
			}

			var a = this._active;
			this._timer += dt;

			switch (a.type) {
				case 0:
					if (this._timer >= a.dur) {
						this._timer = 0;
						this._active = null;
					}
					break;

				case 1:
					if (a.start == null) {
						a.start = {};
						for (var k in a.prop) {
							a.start[k] = this._object[k];
							a.prop[k] -= a.start[k];
						}
					}

					var d = this._timer * a.durinv;
					if (d >= 1) {
						d = 1;
						this._timer = 0;
						this._active = null;
					}

					d = this.interpolate(d);

					for (var k in a.prop) {
						this._object[k] = a.start[k] + a.prop[k]*d;
					}
					break;

				case 2:
					a.func(this._object);
					this._active = null;
					break;

				case 3:
					for (var k in a.prop) {
						this._object[k] = a.prop[k];
					}
					this._active = null;
					break;
			}

			return end;
		},

		easing: function(id) {
			this._functionId = id;
			return this;
		},

		wait: function(dur) {
			this._tweens.unshift({ type: 0, dur: dur });
			return this;
		},

		to: function(prop, dur) {
			this._tweens.unshift({ type: 1, start: null, prop: prop, dur: dur, durinv: 1/dur });
			return this;
		},

		call: function(func) {
			this._tweens.unshift({ type: 2, func: func });
			return this;
		},

		set: function(prop) {
			this._tweens.unshift({ type: 3, prop: prop });
			return this;
		}
	});

	for (var k in funcIDs) {
		Tween[k] = funcIDs[k];
	}

	
	return Tween;

});