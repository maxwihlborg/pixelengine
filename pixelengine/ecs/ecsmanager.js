define(function() {

	var instance = null;

	var ECSManager = Class.extend({

		initialized: false,

		init: function() {
			if (this.initialized) {
				throw new Error("Cannot initate more than one ECSManager!");
			}

			this._entmasks = {};
			this._entities = {};

			this.initialized = true;
		},

		getEntities: function(complist) {

			var mask = [];
			for (var i = 0, len = complist.length; i < len; i++) {
				mask.push(complist[i]);
			}
			mask.sort();

			var m = mask.join("$");

			if (this._entmasks[m] == null) {
				var self = this;
				this._entmasks[m] = {
					_ents: [],
					_mask: mask,

					foreach: function(fun) {
						var ents = this._ents;
						for (var i = 0, len = ents.length; i < len; i++) {
							var e = self._entities[ents[i]];
							if (e != null) {
								fun(e);
							}
						}
					},
					toArray: function() {
						var ents = this._ents;
						var array = [];
						for (var i = 0, len = ents.length; i < len; i++) {
							var e = self._entities[ents[i]];
							if (e != null) {
								array.push(e);
							}
						}
						return array;
					},

					add: function(ent) {
						for (var m in this._mask) {
							var _m = this._mask[m];
							if (!ent.has(_m)) {
								return;
							}
						}
						this._ents.push(ent.id);
					},

					remove: function(ent) {
						var i = this._ents.indexOf(ent.id);
						if (i !== -1) {
							for (m in this._mask) {
								var _m = this._mask[m];
								if (!ent.has(_m)) {
									this._ents.splice(i, 1);
									return;
								}
							}
						}
					}
				}
				for (var e in this._entities) {
					this._entmasks[m].add(this._entities[e]);
				}
			}

			return this._entmasks[m];
		},

		removeEntity: function(ent) {
			var masks = this._entmasks;
			for (var m in masks) {
				masks[m].remove(ent);
			}
			delete this._entities[ent.id];
		},

		componentAdded: function(ent) {
			var masks = this._entmasks;
			if (this._entities[ent.id] == null) {
				this._entities[ent.id] = ent;
			}
			for (var m in masks) {
				masks[m].add(ent);
			}
		},

		componentRemoved: function(ent) {
			var masks = this._entmasks;
			for (var m in masks) {
				masks[m].remove(ent);
			}
		}

	});

	ECSManager.getInstance = function() {
		if (instance == null) {
			instance = new ECSManager();
		}
		return instance;
	}


	return ECSManager.getInstance();

});