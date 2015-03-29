function prefetch(html) {
  console.log('start parse');
  var files = html.split('\n').map(function (line) {
    return /a rel="prefetch" href="(.+?)"/.exec(line);
  }).filter(function(line) {
    return line !== null;
  }).map(function(line) {
    return line[1];
  });

  console.log('start prefetch', files);

  files.forEach(function(file) {
    caches.open('prefetch').then(function (cache) {
      fetch(file).then(function(response) {
        cache.put(file, response)
      });
    });
  });
}

if ('ServiceWorkerGlobalScope' in self && self instanceof ServiceWorkerGlobalScope) {
  console.log('service worker');
  self.onfetch = function(event) {
    var url = new URL(event.request.url);
    if (!(url.pathname === '/' || url.pathname === '/index.html')) {
      console.log('no prefetch for', url.pathname);
      return;
    }
    console.log('fetch for', url.pathname);
    event.respondWith(fetch(event.request.clone()).then(function (response) {
      var responseInit = {
        statue: response.status,
        statusText: response.statusText,
        headers: response.headers
      }
      return response.clone().body.getReader().read().then(function(body) {
        var bodyString = String.fromCharCode.apply(null, body.value);

        setTimeout(function() {
          prefetch(bodyString);
        }, 0);
        var res = new Response(body.value, responseInit);
        return res;
      });
    }));
  };
} else {
  Promise.race([
      navigator.serviceWorker.register('prefetch.js', { scope: '.' }),
      navigator.serviceWorker.getRegistration()
  ]).then(function() {
    console.log('service worker ready');
  }).catch(console.error.bind(console));
}
