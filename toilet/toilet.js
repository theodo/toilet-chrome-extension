$(function () {
  var men = new Toilet(1, 'Men');
  var menItem = new ToiletView (men, $('ul'));

  var toilets = new Toilets([men]);
  toilets.poll();
  menItem.render();
});

(function () {
  function ToiletView (toilet, $container) {
    this.toilet = toilet;
    this.$container = $container;

    this._ensureElements();

    this.toilet.view = this;
  }

  ToiletView.prototype = {
    render: function () {
      this.$element.append(this.$label);
      this.$element.append(this.$status);
      this.$container.append(this.$element);
    },

    updateStatus: function () {
      this.$status.text(this.toilet.text);
      if (this.toilet.isFree()) {
        this.$status.removeClass('used');
      } else {
        this.$status.addClass('used');
      }
    },

    _ensureElements: function () {
      this.$status  = $('<span/>', { 'class': 'status' });
      this.$label   = $('<span/>', { 'class': 'label', 'text': this.toilet.name + ': ' });
      this.$element = $('<li/>');
    }
  };

  this.ToiletView = ToiletView;

}).call(this);
