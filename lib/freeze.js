function Freeze (reporter, definition) {
  this.reporter = reporter
  this.definition = definition

  reporter.initializeListeners.add(definition.name, Freeze.prototype.init.bind(this))
}

Freeze.prototype.hookListeners = function (col) {
  var self = this

  function isAdminUserAuthenticated (req) {
    return req && req.user && req.user.isAdmin
  }

  function rejectIfAppropriate (req) {
    return self.reporter.settings.findValue('freeze').then(function (freeze) {
      if (isAdminUserAuthenticated() && !self.definition.options.hardFreeze && !freeze) {
        return
      }

      if (!self.definition.options.hardFreeze && !freeze) {
        return
      }

      throw new Error('Editing is frozen through jsreport-freeze extension.')
    })
  }

  col.beforeUpdateListeners.insert(0, 'freeze', col, function (query, update, req) {
    // allow updating schedule.state => the scheduler extension works in the freeze mode
    // but user cannot update any of the schedules properties
    if (col.name === 'schedules' && update.$set.state && Object.keys(update.$set).length === 1) {
      return
    }

    return rejectIfAppropriate(req)
  })

  col.beforeInsertListeners.insert(0, 'freeze', col, function (doc, req) {
    return rejectIfAppropriate(req)
  })

  col.beforeRemoveListeners.insert(0, 'freeze', col, function (query, req) {
    return rejectIfAppropriate(req)
  })
}

Freeze.prototype.init = function () {
  var self = this
  for (var key in this.reporter.documentStore.collections) {
    // these are dynamic runtime entities which are not freezed
    if (key === 'settings' || key === 'tasks' || key === 'reports') {
      continue
    }

    var col = self.reporter.documentStore.collections[key]
    self.hookListeners(col)
  }
}

module.exports = function (reporter, definition) {
  new Freeze(reporter, definition)
}
