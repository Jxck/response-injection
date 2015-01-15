# Response Injection

## description

PoC of mocking networks access from browser in testing.
inject custom Response to XHR from Service Worker,
and you can update mock data with only reload the window thread.


## how to use

```js
Injector(
// response mock data
{
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
},

// option
{
  ignore: ['/', '/test.js', '/main.js'], // ignore injection (default [])
  scope: '.' // scope for register worker (default '/')
}

).then(

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
```

## Sample

```sh
$ git clone ttps://github.com/Jxck/response-injection
$ cd response-injection/sample
$ python -m SimleHTTPServer 3000 # or like your own
```

and open http://localhost:3000/

## TODO

- write test
- write more readme
- add to bower
- support more mock style
 - array of Response
 - support body condittion

## License

The MIT License (MIT)
Copyright (c) 2013 Jxck
