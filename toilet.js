$(function () {
  var men = new Toilet($('#men'), 'captor1');
  var women = new Toilet($('#women'), 'captor2');
  var toilets = new Toilets(men , women);
  toilets.fetch();
});

(function () {
  var Toilets = function Toilets(men, women) {
    this.men = men;
    this.women = women;
  };

  Toilets.prototype = {
    fetch: function () {
      var url = 'http://lights.theodo.fr';
 
      $.get(url, $.proxy(function (data) {
        this.men.status = data[this.men.captor];
        this.men.update();

        this.women.status = data[this.women.captor];
        this.women.update();
      }, this), 'json');
    }
  };

  this.Toilets = Toilets;
}).call(this);

(function () {
  var Toilet = function Toilet(element, captor) {
    this.$element = $(element);
    this.$status  = $('.status', this.$element);
    this.captor = captor;
    this.status = 1000;
  };

  Toilet.prototype = {
    isFree: function () {
      return this.status > 80;
    },

    update: function () {
      if (this.isFree()) {
        this.$status.removeClass('used');
        this.$status.text('Free');
      } else {
        this.$status.addClass('used');
        this.$status.text('Used');
      }
    }
  };

  this.Toilet = Toilet;
}).call(this);
