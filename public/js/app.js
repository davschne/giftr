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

var user;

function login() {
  var userName = $('.firstname').val();
  user = storage.getUser(userName);
  var friendName = $('.friendfirstname').val();
  var friend = new Friend (friendName);
  user.addFriend(friend);
  var friendPane = new FriendPane(user);
}

$('startbutton').on('click', login);

var storage = {
  storeUser: function(user) {
    var friends = user.getAllFriends();
    localStorage.setItem(user.name, JSON.stringify(friends));
  },

  getUser: function(name) {
    var user = new User(name);
    var retrieved = localStorage.getItem(name);
    if (retrieved) {
      user.populateFriends(JSON.parse(retrieved));
    }
    return user;
  }
}

// Restoring a user will look a bit like this:
//
// var name = $('input').value;
// var user = storage.restoreUser(name);
// friendPane.showPeople();
// etc.

//load(user)
//   - display user's friends
//   - set up event listeners for selecting, adding, and removing friends
//   (prob. by using methods below)

// highlight(friend)

//   - update DOM to add class 'highlight' to friend

// unhighlight()

//   - update DOM to remove class 'highlight' from all friends

// addFriend(friend)

// removeFriend(string name)
function FriendPane(user) {
  $list = $('.friendsList');

  for (var i = 0; i < user.friends.length; i++) {
    $list.append('<li>' + user.friends[i].name + '</li>');
  }

  $('.addFriend').on('click', function() {
    $list.append('<input type="text" id="new-friend" placeholder="Name" autofocus /><button id="add">Add</button>');
    $('#add').on('click', function() {
      $list.append('<li>' + $('#new-friend').val() + '</li>');
      $('#new-friend').remove();
      $('#add').remove();
      storage.storeUser();
    });
  });
}

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

    function addGift(){};

    // Create list of gifts from Friend object
    $list = $('<ul class="mainList"></ul>');
    for (var i = 0; i < friend.gifts.length; i++) {
      $list = $list.append('<li>' + friend.gifts[i] + '</li>');
    }
    // Put it in the DOM
    $('.main-pane ul').replaceWith($list);

    // Enable event listeners:

    // Add gift idea
    $('#add-gift').on("click", function() {
      this.preventDefault();
      $
    })

    // Select gift idea

    // Delete gift idea
  };
}

