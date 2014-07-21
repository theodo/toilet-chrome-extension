window.addEventListener('load', function () {
  var men = new Toilet(1, 'Men');
  var toilets = new Toilets([men]);
  toilets.poll();
})
