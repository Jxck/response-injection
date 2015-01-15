function get(url) {
  return new Promise(function(done, fail) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.addEventListener('load', function() {
      console.log(xhr.status);
      if(xhr.status >= 400) {
        return fail(xhr.response);
      }
      done(xhr.response);
    });
    xhr.addEventListener('error', fail);
    xhr.send();
  });
}
