'use strict';

var _ = require('underscore');
var util = require('util');
var wce = require('wce');
var config = require('../lib/config');

var WCE = new wce(config.get('extractors') || ['read-art', 'node-readability'], config.get('options') || {});

module.exports = function (server) {
  server.get('/', function (req, res, next) {
    if (_.isUndefined(req.query.url) || _.isEmpty(req.query.url)) {
      res.send(404, {
        error: util.format('Please provide an ?url=... parameter. (Example: http://localhost:%s/?url=http://cnn.com)', config.get('port') || 8001)
      });
    }
    else {
      try {
        WCE.extract(encodeURI(req.query.url))
          .on('success', function (result, errors) {
            res.send(200, {
              content: result.content,
              errors: util.inspect(errors),
              component: result.component
            });
          })
          .on('error', function (errors) {
            res.send(404, {
              errors: util.inspect(errors)
            });
          });
      } catch (error) {
        console.log(error);
        res.send(404, util.inspect(error));
      }
    }

    return next();
  });
};
