// write test as usual
function test() {
  console.log('====================');
  console.log('start test');

  get('/success').then(function(res) {
    console.log(res);
  }).catch(function(err) {
    console.assert(false);
  });

  get('/fail').then(function(res) {
    console.assert(false);
  }).catch(function(err) {
    console.log(err);
  });

  // etc
}

setTimeout(test, 1000);
