/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const FollowToggle = __webpack_require__(1);
	const UsersSearch = __webpack_require__(2);
	const TweetCompose = __webpack_require__(3);
	
	$(function () {
	  $('.follow-toggle').each (function (index, el) {
	    new FollowToggle (el);
	  });
	
	  $('.users-search').each (function (index, el) {
	    new UsersSearch (el);
	  });
	
	  $('.tweet-compose').each (function (index, el) {
	    new TweetCompose (el);
	  });
	
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	FollowToggle = __webpack_require__(1);
	
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


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map