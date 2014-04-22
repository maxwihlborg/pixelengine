define([
	"pixelengine/utils/util",
	"pixelengine/ecs/ecsmanager",
	"pixelengine/ecs/component"
], function(util, ECSManager, Component) {

	var Entity = Class.extend({

		id: null,

		init: function(id) {
			this.id = id || util.getUUID();
		},

		destroy: function() {
			for (var c in this) {
				if (this[c] instanceof Component) {
					this[c] = null;
				}
			}
			ECSManager.removeEntity(this);
		},

		get: function(compname) {
			return this[compname];
		},

		has: function(compname) {
			return this[compname] != null;
		},

		add: function(comp) {
			var n = comp.name;
			if (this[n] == null) {
				this[n] = comp;
				ECSManager.componentAdded(this);
			}
			return this;
		},

		remove: function(comp) {
			var n = typeof comp === "string" ? comp : comp.name;
			if (this[n] != null) {
				this[n] = null;
				ECSManager.componentRemoved(this);
			}
			return this;
		}

	});


	return Entity;

});