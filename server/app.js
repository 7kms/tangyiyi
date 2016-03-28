/**
 * Created by tangliang on 16/2/28.
 */
var express = require('express');
var app = express();
//console.log(app);
console.log(app.locals.title);

/*
app.get('/',function(req,res){
 // console.log(req.headers['user-agent']);
 // console.log(req);
  res.send(req.headers['user-agent']);
});
var server = app.listen(3000,function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
*/
