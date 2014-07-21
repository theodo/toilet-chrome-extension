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
      var context = this;
      var xhr = new XMLHttpRequest();

      xhr.open("GET", this.url, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          // JSON.parse does not evaluate the attacker's scripts.
          var resp = JSON.parse(xhr.responseText);
          console.log(resp);

          context.toilets[0].update(resp[0]);

          context.updateBrowserAction();
        }
      }
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
    this.minValue  = 900;
    this.value     = 1000;
    this.text      = null;
  };

  Toilet.prototype = {
    isFree: function () {
      return this.value < this.minValue;
    },

    update: function (data) {
      this.value = data.value;

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
