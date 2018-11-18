var express  = require('express');
var app      = express();
var fs       = require("fs");
var morgan   = require("morgan");
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();

var accessLogStream = fs.createWriteStream(__dirname + '/logs/access.log', {flags: 'a'});
app.use(morgan('combined',{stream: accessLogStream}));

var stable = 'http://localhost:5000';
var beta = 'http://localhost:5001';

app.all("/*", function(req, res) {
    console.log('redirecting to stable');
    apiProxy.web(req, res, {target: stable});
});

app.all("/beta/*", function(req, res) {
    console.log('redirecting to beta');
    apiProxy.web(req, res, {target: beta});
});

console.log("Starting reverse proxy server");
app.listen(3000);
