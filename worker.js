
self.addEventListener('message', function(message) {
  console.log('mock data from main', message.data);

  var mockdata = JSON.parse(message.data);
  console.log('mockdata', mockdata);

  console.log('set listener using mock data');

  self.onfetch = function(event) {

    function createResponse(path) {
      console.log('===============', path);
      var head = mockdata[path].head;
      var body = JSON.stringify(mockdata[path].body);
      console.log(head, body);
      return new Response(body, head);
    }

    var path = (new URL(event.request.url)).pathname;
    console.log('fetch event for', path);

    if(['/', '/test.js', '/main.js'].indexOf(path) >= 0) {
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
