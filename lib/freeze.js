function Freeze(reporter, definition) {
  this.reporter = reporter;
  this.definition = definition;

  reporter.initializeListener.add(definition.name, Freeze.prototype.init.bind(this));
}

Freeze.prototype.hookListeners = function(col) {
  var self = this;

  function isAdminUserAuthenticated() {
    return process.domain && process.domain.req && process.domain.req.user && process.domain.req.user.isAdmin;
  }

  function rejectIfAppropriate() {
    return self.reporter.settings.findValue("freeze").then(function(freeze) {
      if (isAdminUserAuthenticated() && !self.definition.options.hardFreeze && !freeze) {
        return;
      }

      if (!self.definition.options.hardFreeze && !freeze) {
        return;
      }

      throw new Error("Editing is frozen through jsreport-freeze extension.");
    });
  }

  col.beforeUpdateListeners.insert(0, "freeze", col, rejectIfAppropriate);

  col.beforeInsertListeners.insert(0, "freeze", col, rejectIfAppropriate);

  col.beforeRemoveListeners.insert(0, "freeze", col, rejectIfAppropriate);
}

Freeze.prototype.init = function() {
  var self = this;
  for (var key in this.reporter.documentStore.collections) {
    if (key !== 'templates' && key !== 'images' && key !== 'scripts') {
      continue
    }

    var col = self.reporter.documentStore.collections[key];
    self.hookListeners(col);
  }
}

module.exports = function(reporter, definition) {
  var freeze = new Freeze(reporter, definition);
}
