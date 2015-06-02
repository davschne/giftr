function Friend(name) {
  this.name = name;
  this.gifts = [];
}

function Gift(name) {
  this.name = name;
}

function User(name) {
  this.name = name;
  var friends = {};

  this.getFriend = function(name) {
    return friends[name];
  };

  this.addFriend = function(friend) {
    if (friend instanceof Friend) {
      friends[friend.name] = friend;
      return true;
    } else {
      return false;
    }
  };

  this.removeFriend = function(name) {
    if (friends[name]) {
      delete friends[name];
      return true;
    } else {
      return false;
    }
  };

  this.keys = function() {
    return Object.keys(friends);
  };

  this.getAllFriends = function() {
    return friends;
  };

  this.populateFriends = function(object) {
    friends = object;
  };
}

function Storage() {
  this.storeUser = function(user) {
    var friends = user.getAllFriends();
    localStorage.setItem(user.name, JSON.stringify(friends));
  };

  this.restoreUser = function(name) {
    var user = new User(name);
    var friends = JSON.parse(localStorage.getItem(name));
    user.populateFriends(friends);
    return user;
  };
}

// Restoring a user will look a bit like this:
//
// var name = $('input').value;
// var user = storage.restoreUser(name);
// friendPane.showPeople();
// etc.

//  ----------
// | MainPane |
//  ----------
//   Methods:

//     clear()
//     enableGiftIdeasView(friend)
//       - use friend to populate the list of gifts
//       - enable event listeners (can modify friend.gifts)
//       - may want some internal functions to deal with the interface for adding gifts, reordering list, (and anything else)

function MainPane() {
  this.clear = function() {
    $('.main-pane').empty();
  };
  this.enableGiftIdeasView = function(friend) {

    var $list;

    function addGift();

    // Create list of gifts from Friend object
    $list = $('<ul class="mainList"></ul>');
    for (var i = 0; i < friend.gifts.length; i++) {
      $list = $list.append('<li>' + friend.gifts[i] + '</li>');
    }
    // Put it in the DOM
    $('.main-pane ul').replaceWith($list);

    // Enable event listeners:

    // Add gift idea
    // $('#add-gift').on("click", function() {
    //   this.preventDefault();
    //   $
    // })
/*
    $('.addFriend').on('click', function() {
    $list.append('<input type="text" id="new-friend" placeholder="Name" autofocus /><button id="add">Add</button>');
    $('#add').on('click', function() {
      this.addFriend($('#new-friend').val());
      $('#new-friend').remove();
      $('#add').remove();
    });

  this.addFriend = function(friend) {
    $list.append('<li>' + friend + '</li>');
  };
*/

    // Select gift idea

    // Delete gift idea
  };
}
