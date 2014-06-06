'use strict';

var Task    = require('../models/task');
var Testem  = require('testem');
var Promise = require('../ext/promise');
var rimraf  = Promise.denodeify(require('rimraf'));

module.exports = Task.extend({
  run: function(options) {
    return options.watcher.builder.build().then(function() {
      var testemOptions = { file: options.configFile, port: options.port, cwd: options.liveOutputDir };

      var watcher = options.watcher;
      var testem  = new Testem();
      testem.startDev(testemOptions, function(code) {
        rimraf(options.liveOutputDir)
          .finally(function() {
            process.exit(code);
          });
      });

      watcher.on('change', function() {
        testem.restart();
      });
    });
  }
});