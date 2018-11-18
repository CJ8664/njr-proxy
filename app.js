var express = require('express');
var app = express();
var fs = require("fs");
var morgan = require("morgan");
var httpProxy = require('http-proxy');
var expressip = require('express-ip');
var apiProxy = httpProxy.createProxyServer();

var accessLogStream = fs.createWriteStream(__dirname + '/logs/access.log', {
  flags: 'a'
});

app.use(morgan('combined', {
  stream: accessLogStream
}));

var stable = 'http://localhost:5000';
var beta = 'http://localhost:5001';

app.all("/*", function(req, res) {
  const ipInfo = req.ipInfo;
  console.log('redirecting to stable');
  apiProxy.web(req, res, {
    target: stable
  });
  console.log(ipInfo.city);

  // console.log('redirecting to beta');
  // apiProxy.web(req, res, {target: beta});
});

console.log("Starting reverse proxy server");
app.listen(3000);
