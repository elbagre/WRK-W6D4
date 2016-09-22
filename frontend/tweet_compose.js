class TweetCompose {
  constructor (el) {
    this.$el = $(el);
    this.submit();
  }

  submit () {
    this.$el.on("submit", (e) => {
      e.preventDefault();
      const submittedData = $(e.currentTarget).serialize();
      $(':input').each (function (idx, input) {
        $(input).prop('disabled', true);
      });

      $.ajax({
        method: "POST",
        url: "/tweets",
        dataType: "json",
        data: submittedData,
        success: (tweet) => {
          this.handleSuccess(tweet);
        }
      });
    });
  }

  handleInput () {
    const $textArea = $(this.$el.find('textarea'));
    $textArea.on("upkey", (e) => {
      $('.chars-left').text(140 - $textArea.val().length);
    });
  }

  clearInput () {
    const s = $(this.$el.find('textarea')).val('');
    // debugger
    $(this.$el.find('option:selected')).prop('selected', false);
  }

  handleSuccess (tweet) {
    this.clearInput();
    $(':input').each (function (idx, input) {
      $(input).prop('disabled', false);
    });
    const $li = $('<li>');
    const $ul = $('#feed');
    $li.append(JSON.stringify(tweet));
    $ul.append($($li));
  }
}

module.exports = TweetCompose;
