var http = require('http'),
    _ = require('underscore'),
    qs = require('querystring'),
    prx = require('http-proxy');

var lucilleOptions = {
    passThrough: true
};

http.createServer(function (req, res) {
  if(req.headers["x-lucille-command"] !== undefined){
      processOptions(lucilleOptions, req, res);
  }else{
      processRequest(lucilleOptions, req, res);
  }
}).listen(process.env.PORT);

var processOptions = function(options, req, res){
    console.log("parsing options");
    var body = '';
    req.on('data', function(data){ body += data; });
    req.on('end', function(){parseOptions(options, req, res, qs.parse(body))});
};

var parseOptions = function(options, req, res, body){
    var updatedOptions = updateOptions(options, body); 
    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end(JSON.stringify(updatedOptions)+"\n");
    lucilleOptions = updatedOptions;
};

var updateOptions = function(options, body){
    _.each(options, function(v, k, orig){
        if(body[k] !== undefined){
            orig[k] = body[k];
        }
    });
    return options;
};

var processRequest = function(options, req, res){
    switch(options.passThrough){
        case true: passThroughReq(req, res); break;
        case false: processReqWithOptions(options, req, res); break;
    }
};

var passThroughReq = function(req, res){
    res.end("should've been a passthrough");
    // passthru function from proxy lib goes here
};

var processReqWithOptions = function(options, req, res){
    
};