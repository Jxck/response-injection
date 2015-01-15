var option = {
  ignore: ['/', '/test.js', '/main.js'],
  scope: '.'
};

Injector({
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
      status: 404,
      statusText: 'Not Found',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    body: {
      message: 'user not found'
    }
  }
}, option).then(

// write test as usual
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

).catch(console.error.bind(console));
