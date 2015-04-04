if ('ServiceWorkerGlobalScope' in self && self instanceof ServiceWorkerGlobalScope) {
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

  self.addEventListener('message', function(message) {
    var data = JSON.parse(message.data);
    console.log('message from main', data);

    var mockdata = data.mockdata;
    var option = data.option;
    console.log('mockdata', mockdata);
    console.log('option', option);

    console.log('set listener using mock data');

    self.onfetch = function(event) {

      function createResponse(path) {
        var head = mockdata[path].head;
        var body = JSON.stringify(mockdata[path].body);
        console.log(head, body);
        return new Response(body, head);
      }

      var path = (new URL(event.request.url)).pathname;
      console.log('fetch event for', path);

      if(option.ignore.indexOf(path) >= 0) {
        // ignore
        return;
      }

      var response = createResponse(path);
      console.log('mock response', response);

      event.respondWith(response);
    };

    console.log('response to main after setting fetch listener');
    message.ports[0].postMessage('done');

  });
}

if (typeof window !== 'undefined') {
  function Injector(mockdata, option) {
    console.log(mockdata, option);
    option = option || {};
    option.scope = option.scope || '.';
    option.ignore = option.ignore || [];

    return Promise.race([
        navigator.serviceWorker.register('injector.js', { scope: option.scope }),
        navigator.serviceWorker.getRegistration(),
    ]).then(function(registoration) {
      console.log('service worker ready');

      var msgchan = new MessageChannel();

      var message = JSON.stringify({
        mockdata: mockdata,
        option: option
      });

      // console.log('send mock data to the worker');
      if(navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(message, [msgchan.port2]);
      } else {
        navigator.serviceWorker.addEventListener('controllerchange', function(registoration) {
          console.log('controllerchange', arguments);
          navigator.serviceWorker.controller.postMessage(message, [msgchan.port2]);
        });
      }

      return new Promise(function(done, fail) {
        // addEventListener だと動かない?
        // msgchan.port1.addEventListener('message', function(event) {
        msgchan.port1.onmessage = function(event) {
          // console.log('response from worker', event);
          if(event.data === 'done') {
            console.log('ready to test');
            done();
          } else {
            fail(new Error('event.data'));
          }
        };
      });
    })
  }
}
