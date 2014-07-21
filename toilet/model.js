(function () {
  /**
   * Toilets collection.
   *
   * @param men
   * @param women
   */
  var Toilets = function Toilets(toilets) {
    this.toilets = toilets;
    this.intervalId = null;
    this.delay = 3000;
    this.url = 'http://192.168.102.13';
  };

  Toilets.prototype = {
    fetch: function () {
      // Store this in the context.
      var xhr = new XMLHttpRequest();

      xhr.open("GET", this.url, true);
      xhr.onreadystatechange = (function() {
        if (xhr.readyState == 4) {
          // JSON.parse does not evaluate the attacker's scripts.
          var resp = JSON.parse(xhr.responseText);
          this.toilets.every(function (toilet) { toilet.update(resp[0]) });
          this.updateBrowserAction();
        }
      }).bind(this);
      xhr.send();
    },

    updateBrowserAction: function () {
      var iconPath = 'img/toilets_1.png';


      if (this.toilets[0].isFree()) {
        iconPath = 'img/toilets_1.png';
        title    = 'Nobody is in the toilets.';
      } else {
        iconPath = 'img/toilets_2.png';
        title    = 'Men are used.';
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
  var Toilet = function Toilet(id, name) {
    this.name      = name;
    this.data      = {
        value: 900
    };
    this.minValue  = 900;
    this.text      = null;
  };

  Toilet.prototype = {
    isFree: function () {
      return this.data.hasOwnProperty('occupationStatus') && false === this.data.occupationStatus;
    },

    update: function (data) {
      this.data = data;

        if (this.isFree()) {
        this.text = 'Free';
      } else {
        this.text = 'Used';

        // occupied for more than 20 minutes
        var duration = this.data.time - this.data.since;
        if (duration >= (15 * 60 * 1000)) {
            this.text = "Maybe somebody forgot to shutdown the light!"
        }
      }

      if (this.hasOwnProperty('view')) {
        this.view.updateStatus();
      }
    }
  };

  this.Toilet = Toilet;
}).call(this);
