if ('ServiceWorkerGlobalScope' in self && self instanceof ServiceWorkerGlobalScope) {
  console.log('service worker');

  function prefetch(html) {
    'use strict';
    console.log('start parse');
    let files = html.split('\n').map(function (line) {
      return /a rel="prefetch" href="(.+?)"/.exec(line);
    }).filter(function(line) {
      return line !== null;
    }).map(function(line) {
      return line[1];
    }).forEach(function(file) {
      // list for rel="prefetch"
      caches.open('prefetch').then(function (cache) {
        // check cache exists
        cache.match(file).then(function(matched) {
          if(matched) {
            // cached
            console.log('already cached', file);
            return;
          }
          // prefetch
          fetch(file).then(function(response) {
            console.log('prefetch and cache', file);
            cache.put(file, response)
          });
        });
      });
    });
  }

  self.onfetch = function(event) {
    'use strict';
    console.log('fetch for', event.request.url);
    event.respondWith(caches.open('prefetch').then(function(cache) {
      return cache.match(event.request).then(function(matched) {
        if (matched) {
          console.log('cache hit!!!!');
          return matched;
        }
        return fetch(event.request.clone()).then(function (response) {
          if (response.headers.get('content-type') !== 'text/html') {
            // don't parse body
            return response;
          }

          return response.clone().body.getReader().read().then(function(body) {
            let decoder = new TextDecoder;
            let bodyString = decoder.decode(body.value);

            // prefetch in async
            setTimeout(function() {
              prefetch(bodyString);
            }, 0);

            // re-generate response
            let responseInit = {
              statue: response.status,
              statusText: response.statusText,
              headers: response.headers
            }
            let res = new Response(body.value, responseInit);
            return res;
          });
        });
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
