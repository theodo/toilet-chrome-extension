$(function () {
  var men = new Toilet($('#men'), 'captor1');
  var women = new Toilet($('#women'), 'captor2');
  var toilets = new Toilets(men , women);
  toilets.fetch();
  toilets.poll();
});

(function () {
  var Toilets = function Toilets(men, women) {
    this.men = men;
    this.women = women;
    this.intervalId = null;
    this.delay = 3000;
    this.url = 'http://lights.theodo.fr';
  };

  Toilets.prototype = {
    fetch: function () {
      $.get(this.url, $.proxy(function (data) {
        this.men.status = data[this.men.captor];
        this.men.update();

        this.women.status = data[this.women.captor];
        this.women.update();

          this.updateIcon();
      }, this), 'json');
    },

    poll: function () {
      if (null == this.intervalId) {
        this.intervalId = setInterval($.proxy(this.fetch, this), this.delay);
      }
    },

    stopPoll: function () {
      if (null !== this.intervalId) {
        clearInterval(this.intervalId);
      }
    },

    updateIcon: function () {
      var iconPath = 'img/toilets_1.png';

      if (this.women.isFree()) {
        if (this.men.isFree()) {
          iconPath = 'img/toilets_1.png'
        } else {
          iconPath = 'img/toilets_2.png'
        }
      } else {
        if (this.men.isFree()) {
          iconPath = 'img/toilets_3.png'
        } else {
          iconPath = 'img/toilets_4.png'
        }
      }

      chrome.browserAction.setIcon({ path: iconPath });
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
