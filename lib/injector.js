if ('ServiceWorkerGlobalScope' in self && self instanceof ServiceWorkerGlobalScope) {
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
        console.log(path);
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
} else {
  function Injector(mockdata, option) {
    console.log(mockdata, option);
    option = option || {};
    option.scope = option.scope || '.';
    option.ignore = option.ignore || [];

    return Promise.race([
        navigator.serviceWorker.register('/lib/injector.js', { scope: option.scope }),
        navigator.serviceWorker.getRegistration()
    ]).then(function() {

      // console.log('service worker ready');

      // console.log('send mock data to the worker');

      var msgchan = new MessageChannel();

      var message = JSON.stringify({
        mockdata: mockdata,
        option: option
      });
      navigator.serviceWorker.controller.postMessage(message, [msgchan.port2]);

      return new Promise(function(done, fail) {
        // addEventListener だと動かない
        msgchan.port1.onmessage = function(event) {
          // console.log('response from worker', event);
          if(event.data === 'done') {
            done();
          } else {
            console.error(event.data);
            fail();
          }
        };
      });
    })
  }
}
