var http = require('http');
var fs = require('fs');
var url = require('url');

var ctype = {
  'js': 'application/javascript',
  'html': 'text/html',
  'css': 'text/css'
}

http.createServer(function(req, res) {
  console.log(req.url);
  var file = '';
  var ext = '';
  var query = url.parse(req.url, true).query;

  if (query.id) { // ?id=1 => 1.html
    file = query.id + '.html';
    ext = 'html';
  } else {
    file = req.url.replace('/', '');
    ext = file.split('.').pop();
  }
  res.writeHead(200, {'Content-Type': ctype[ext] });
  fs.createReadStream(file).pipe(res);
}).listen(3000);
