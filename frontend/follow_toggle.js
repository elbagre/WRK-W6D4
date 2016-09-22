class FollowToggle {

  constructor (el) {
    // debugger
    this.$el = $(el);
    this.userId = this.$el.data("user-id");
    this.followState = this.$el.data("initial-follow-state");
    this.render();
    this.handleClick();
  }

  render () {
    if (this.followState === "unfollowing") {
      this.followState = false;
    } else if (this.followState === "following") {
      this.followState = true;
    }

    if (this.followState === true) {
      this.$el.text("Unfollow!");
    } else if (this.followState === false) {
      this.$el.text("Follow!");
    }
  }

  handleClick () {
    const followToggle = this;
    this.$el.on("click", (e) => {
      e.preventDefault();
      this.$el.prop('disabled', true);
      if (this.followState === false) {
        $.ajax({
          method: 'POST',
          url: `/users/${this.userId}/follow`,
          dataType: 'json',
          success () {
            followToggle.followState = "following";
            followToggle.$el.prop('disabled', false);
            followToggle.render();
          },
          error () {
            followToggle.$el.prop('disabled', false);
            followToggle.render();
          }
        });
      } else {
        $.ajax({
          method: 'DELETE',
          url: `/users/${this.userId}/follow`,
          dataType: 'json',
          success () {
            followToggle.followState = "unfollowing";
            followToggle.$el.prop('disabled', false);
            followToggle.render();
            // followToggle.render();
          },
          error () {
            followToggle.$el.prop('disabled', false);
            followToggle.render();
          }
        });
      }
    });
  }
}

module.exports = FollowToggle;
