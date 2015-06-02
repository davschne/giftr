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
    });
  });
}
var friendPane = new FriendPane();





