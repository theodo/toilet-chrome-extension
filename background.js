window.addEventListener('load', function () {
  var men = new Toilet('captor1', 'Men');
  var women = new Toilet('captor2', 'Women');
  var toilets = new Toilets(men , women);
  toilets.poll();
})