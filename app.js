var http = require('http'),
    _ = require('underscore'),
    qs = require('querystring'),
    prx = require('http-proxy');

var lucilleOptions = {
    passThrough: true
};

http.createServer(function (req, res){
    res.end("yay!");
}).listen(3001);

var lucilleProxy = new prx.HttpProxy({
  target: {
    host: 'localhost', 
    port: 3001
  }
});

http.createServer(function (req, res) {
  if(req.headers["x-lucille-command"] !== undefined){
      processOptions(lucilleOptions, req, res);
  }else{
      processRequest(lucilleOptions, req, res, lucilleProxy);
  }
}).listen(3000);

var processOptions = function(options, req, res){
    console.log("processing options");
    var body = '';
    req.on('data', function(data){ body += data; });
    req.on('end', function(){parseOptions(options, req, res, qs.parse(body))});
};

var parseOptions = function(options, req, res, body){
    console.log("parsing options");
    var updatedOptions = updateOptions(options, body); 
    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end(JSON.stringify(updatedOptions)+"\n");
    lucilleOptions = updatedOptions;
};

var updateOptions = function(options, body){
    console.log("updating options");
    _.each(options, function(v, k, orig){
        if(body[k] !== undefined){
            orig[k] = JSON.parse(body[k]);
        }
    });
    return options;
};

var processRequest = function(options, req, res, proxy){
    console.log("processing request");
    switch(options.passThrough){
        case true: passThroughReq(options, req, res, proxy); break;
        case false: processReqWithOptions(options, req, res, proxy); break;
    }
};

var passThroughReq = function(options, req, res, proxy){
    console.log("passing through");
    proxy.proxyRequest(req, res);
};

var processReqWithOptions = function(options, req, res, proxy){
    res.write("faked something");
    proxy.proxyRequest(req, res);
};