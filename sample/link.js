'use strict';
let prefetch = document.querySelectorAll('[rel=prefetch]');
console.log(prefetch);

Array.prototype.slice.call(targets).map(function(target) {
  return target.href || target.src;
}).forEach(function(url) {
  let link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
});
