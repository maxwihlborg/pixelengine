define([
	"pixelengine/ecs/ecsmanager"
], function(ECSManager) {

	var System = Class.extend({

		entities: null,

		init: function() {
			if (arguments.length === 0) {
				throw new Error("Must specify dependent components in System constructor.")
				return;
			}
			this.entities = ECSManager.getEntities(Array.prototype.slice.call(arguments));
		}

	});


	return System;

});