var statusText = {
  "100":"Continue",
  "101":"Switching Protocols",
  "102":"Processing",
  "200":"OK",
  "201":"Created",
  "202":"Accepted",
  "203":"Non-Authoritative Information",
  "204":"No Content",
  "205":"Reset Content",
  "206":"Partial Content",
  "207":"Multi-Status",
  "208":"Already Reported",
  "226":"IM Used",
  "300":"Multiple Choices",
  "301":"Moved Permanently",
  "302":"Found",
  "303":"See Other",
  "304":"Not Modified",
  "305":"Use Proxy",
  "306":"(Unused)",
  "307":"Temporary Redirect",
  "308":"Permanent Redirect",
  "400":"Bad Request",
  "401":"Unauthorized",
  "402":"Payment Required",
  "403":"Forbidden",
  "404":"Not Found",
  "405":"Method Not Allowed",
  "406":"Not Acceptable",
  "407":"Proxy Authentication Required",
  "408":"Request Timeout",
  "409":"Conflict",
  "410":"Gone",
  "411":"Length Required",
  "412":"Precondition Failed",
  "413":"Payload Too Large",
  "414":"URI Too Long",
  "415":"Unsupported Media Type",
  "416":"Range Not Satisfiable",
  "417":"Expectation Failed",
  "422":"Unprocessable Entity",
  "423":"Locked",
  "424":"Failed Dependency",
  "426":"Upgrade Required",
  "428":"Precondition Required",
  "429":"Too Many Requests",
  "431":"Request Header Fields Too Large",
  "500":"Internal Server Error",
  "501":"Not Implemented",
  "502":"Bad Gateway",
  "503":"Service Unavailable",
  "504":"Gateway Timeout",
  "505":"HTTP Version Not Supported",
  "506":"Variant Also Negotiates",
  "507":"Insufficient Storage",
  "508":"Loop Detected",
  "510":"Not Extended",
  "511":"Network Authentication Required",
}


if ('ServiceWorkerGlobalScope' in self && self instanceof ServiceWorkerGlobalScope) {

  self.addEventListener('activate', function() {
    function Res(callback) {
      this.headers = new Headers();
      this.status = 200;
      this.body = null;
      this.next = callback;
    }

    Res.prototype.send = function(body) {
      this.body = body;
      this.next(this);
    }

    function Routing() {
      this.routing = {};
    }

    Routing.prototype.get = function(path, callback) {
      this.routing[path] = callback;
    }

    Routing.prototype.route = function(request, callback) {
      'use strict';
      let path = (new URL(request.url)).pathname;

      this.routing[path](request, new Res(function(res) {
        let responseInit = {
          status: res.status,
          statusText: statusText[String(res.status)],
          headers: res.headers,
        }
        let response = new Response(res.body, responseInit);
        response.headers.set('content-type', 'text/plain');
        callback(response);
      }));
    }

    self.routing = new Routing();

    routing.get('/success', function(req, res) {
      res.status = 200;
      res.send('success');
    });

    routing.get('/fail', function(req, res) {
      res.status = 400;
      res.headers.set('x-hoge', 'yey');
      res.send('fail');
    });
  });

  self.addEventListener('fetch', function(e) {
    'use strict';
    let request = e.request;
    self.routing.route(request, function(response) {
      console.log(response);
      e.respondWith(response);
    });
  });

  self.skipWaiting().then(function() {
    console.warn('skipWaiting');
  });

  ['install' , 'activate' , 'beforeevicted' , 'evicted'].forEach(function(ev) {
    self.addEventListener(ev, function(e) {
      console.info(e);
    });
  });

  self.addEventListener('activate', function(e) {
    console.log('activate');
    e.waitUntil(self.clients.claim());
  });
}

if (typeof window !== 'undefined') {
  navigator.serviceWorker.register('injector.js', { scope: '.' });
}
