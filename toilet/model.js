(function () {
  /**
   * Toilets collection.
   *
   * @param men
   * @param women
   */
  var Toilets = function Toilets(men, women) {
    this.men = men;
    this.women = women;
    this.intervalId = null;
    this.delay = 3000;
    this.url = 'http://lights.theodo.fr';
  };

  Toilets.prototype = {
    fetch: function () {
      // Store this in the context.
      var context = this;
      var xhr = new XMLHttpRequest();

      xhr.open("GET", this.url, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          // JSON.parse does not evaluate the attacker's scripts.
          var resp = JSON.parse(xhr.responseText);

          if (resp.hasOwnProperty(context.men.captor) && resp.hasOwnProperty(context.women.captor)) {
            context.men.update(resp[context.men.captor]);
            context.women.update(resp[context.women.captor]);

            context.updateBrowserAction();
          }
        }
      }
      xhr.send();
    },

    updateBrowserAction: function () {
      var iconPath = 'img/toilets_1.png';

      if (this.women.isFree()) {
        if (this.men.isFree()) {
          iconPath = 'img/toilets_1.png';
          title    = 'Nobody is in the toilets.';
        } else {
          iconPath = 'img/toilets_2.png';
          title    = 'Men are used.';
        }
      } else {
        if (this.men.isFree()) {
          iconPath = 'img/toilets_3.png';
          title    = 'Women are used.';
        } else {
          iconPath = 'img/toilets_4.png';
          title    = 'Women and men are used.';
        }
      }

      chrome.browserAction.setIcon({ path: iconPath });
      chrome.browserAction.setTitle({ title: title });
    },

    poll: function () {
      if (null === this.intervalId) {
        // Fetch and then schedule polling.
        this.fetch();

        var context = this;
        this.intervalId = setInterval(function () {
          return context.fetch.apply(context);
        }, this.delay);
      }
    }
  };

  this.Toilets = Toilets;

  /**
   * Toilet class.
   *
   * @param captor
   */
  var Toilet = function Toilet(captor, name) {
    this.captor    = captor;
    this.name      = name;
    this.minStatus = 80;
    this.status    = 1000;
    this.text      = null;
  };

  Toilet.prototype = {
    isFree: function () {
      return this.status > this.minStatus;
    },

    update: function (status) {
      this.status = status;

      if (this.isFree()) {
        this.text = 'Free';
      } else {
        this.text = 'Used';
      }

      console.log(this.name + ' is ' + this.text);

      if (this.hasOwnProperty('view')) {
        this.view.updateStatus();
      }
    }
  };

  this.Toilet = Toilet;
}).call(this);
