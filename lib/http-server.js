var fs = require('fs'),
    util = require('util'),
    union = require('union'),
    ecstatic = require('ecstatic');

var HTTPServer = exports.HTTPServer = function (options) {
  options = options || {};

  if (options.root) {
    this.root = options.root;
  }
  else {
    try {
      fs.lstatSync('./public');
      this.root = './public';
    }
    catch (err) {
      this.root = './';
    }
  }
  
  if (options.headers) {
    this.headers = options.headers; 
  }

  this.cache = options.cache || 3600; // in seconds.
  this.autoIndex = options.autoIndex !== false;
  this.server = union.createServer({
    before: [
      ecstatic(this.root, {
        autoIndex: this.autoIndex,
        cache: this.cache
      })
    ],
    headers: this.headers || {}
  });
};

HTTPServer.prototype.listen = function () {
  this.server.listen.apply(this.server, arguments);
};

HTTPServer.prototype.close = function () {
  return this.server.close();
};

exports.createServer = function (options) {
  return new HTTPServer(options);
};
