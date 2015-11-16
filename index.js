'use strict';

var restify, bunyan, routes, log, server, config, cluster;

restify = require('restify');
bunyan = require('bunyan');
routes = require('./routes/');
config = require('./lib/config');
cluster = require('cluster');

// Set the title of process for easier debugging.
// This will be the name of the server too.
process.title = 'wce-api';

log = bunyan.createLogger({
  name: process.title,
  level: process.env.LOG_LEVEL || 'info',
  stream: process.stdout,
  serializers: bunyan.stdSerializers
});

if (cluster.isMaster) {
  var threads = require('os').cpus().length;
  // Max threads should not be higher than the number of CPUs.
  if (config.get('max-threads') && config.get('max-threads') > 0 && config.get('max-threads') <= threads) {
    threads = config.get('max-threads');
  }
  console.log('Server is active. Forking %d workers now.', threads);
  for (var i = 0; i < threads; i++) {
    cluster.fork();
  }
  cluster.on('exit', function (worker) {
    console.error('Worker %d has died! Creating a new one.', worker.id);
    cluster.fork();
  });
}
else {
  server = restify.createServer({
    name: process.title,
    log: log,
    formatters: {
      'application/json': function (req, res, body) {
        res.setHeader('Cache-Control', 'must-revalidate');

        // Does the client *explicitly* accepts application/json?
        var sendPlainText = (req.header('Accept').split(/, */).indexOf('application/json') === -1);

        // Send as plain text
        if (sendPlainText) {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        }

        // Send as JSON
        if (!sendPlainText) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
        return JSON.stringify(body);
      }
    }
  });

  server.use(restify.bodyParser({mapParams: false}));
  server.use(restify.queryParser({mapParams: false}));
  server.use(restify.CORS({origins: config.get('allowed-origins') || '*'}));
  server.use(restify.gzipResponse());

  // Default error handler. Personalize according to your needs.
  server.on('uncaughtException', function (req, res, err) {
    log.error(err);
    res.send(500, {success: false});
  });

  server.on('after', restify.auditLogger({log: log}));
  routes(server);

  console.log('Webpage Content Extractor API worker started on %s port with %d worker id.', config.get('port') || 8001, cluster.worker.id);
  server.listen(config.get('port') || 8001, function () {
    log.info('%s listening at %s', server.name, server.url);
  });
}
