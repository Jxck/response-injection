function Injector(mockdata, option) {
  console.log(mockdata, option);
  option = option || {};
  option.scope = option.scope || '.';
  option.ignore = option.ignore || [];

  return Promise.race([
      navigator.serviceWorker.register('/lib/worker.js', { scope: option.scope }),
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
