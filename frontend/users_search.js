FollowToggle = require('./follow_toggle.js');

class UsersSearch {
  constructor (el) {
    this.$el = $(el);
    this.$input = $(this.$el.children('input'));
    this.$ul = $(this.$el.children('ul'));
    this.handleInput();
  }

  handleInput () {
    const search = this;
    this.$input.on("keyup", (e) => {
      e.preventDefault();
      // debugger
      $.ajax({
        method: "GET",
        url: "/users/search",
        dataType: "json",
        data: { query: this.$input.val() },
        success (data) {
          search.renderResults(data);
        }
      });
    });
  }

  renderResults (data) {
    this.$ul.empty();
    const search = this;
    data.forEach ( function (user) {
      const $li = $('<li>');
      $li.append((`<a href='/users/${user.id}'>${user.username}</a>`));

      const $button = $('<button>');
      $button.data('class', 'follow-toggle');
      $button.data('user-id', user.id);
      $button.data('initial-follow-state', user.followed);
      new FollowToggle($button);
      $li.append($button);

      search.$ul.append($li);
    });
  }
}

module.exports = UsersSearch;
