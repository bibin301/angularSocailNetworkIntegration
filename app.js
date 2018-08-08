/* var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var fs = require('fs');

var https = require('https');

var httpsPort = 8000;
var httpport = process.env.PORT || 7000;
var HOST = 'localhost';
var path = require('path');
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname + '/')));
app.use('/root', express.static(path.join(__dirname + '/root')));
app.use('/root/index.html', express.static(path.join(__dirname + '/root/index.html')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "/root" + "/index.html");
})


app.listen(3009, function () {
    console.log('Example app listening on port 3009!');
}) */

var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var fs = require('fs');
var express = require('express');
var http = require('http');
var https = require('https');

 var path = require('path');
 var key = fs.readFileSync('privatekey.key');
 var cert = fs.readFileSync('certificate.crt');


var https_options = {
    key: key,
    cert: cert,
 passphrase: 'User0463'
   
 
};
var httpsPort = 3010;
var httpport = process.env.PORT || 3011;


app.use('/', express.static(path.join(__dirname + '/')));
app.use('/root', express.static(path.join(__dirname + '/root')));
app.use('/root/index.html', express.static(path.join(__dirname + '/root/index.html')));
app.get('/', function (req, res) {
   
    res.sendFile( __dirname + "/" +"/root" +"/index.html" );
})

https.createServer(https_options, app).listen(httpsPort,function(req,res){

console.log("Catch the action at https://localhost:"+httpsPort);
});

http.createServer(app).listen(httpport,function(req,res){
console.log("Catch the action at http://localhost:"+httpport);
});

