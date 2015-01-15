var mockdata = {
  '/success': {
    head: {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    body: {
      id: 200,
      name: 'jxck',
      mail: 'jxck@example.com'
    }
  },
  '/fail': {
    head: {
      status: 402,
      statusText: 'Not Found',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    body: {
      message: 'user not found'
    }
  }
}

function test() {
  console.log('start test');

  get('/success').then(function(res) {
    console.assert(res.id, 200);
  }).catch(function(err) {
    console.assert(false);
  });

  get('/fail').then(function(res) {
    console.assert(false);
  }).catch(function(err) {
    console.assert(err.message, 'user not found');
  });

  // etc
}

Promise.race([
  navigator.serviceWorker.register('worker.js'),
  navigator.serviceWorker.getRegistration()
]).then(function() {
  console.log('service worker ready');

  console.log('send mock data to the worker');
  var msgchan = new MessageChannel();
  navigator.serviceWorker.controller.postMessage(JSON.stringify(mockdata), [msgchan.port2]);

  return new Promise(function(done, fail) {
    // addEventListener だと動かない
    msgchan.port1.onmessage = function(event) {
      console.log('response from worker', event);
      if(event.data === 'done') {
        done();
      } else {
        fail();
      }
    };
  });
}).then(function() {
  test();
}).catch(console.error.bind(console));
