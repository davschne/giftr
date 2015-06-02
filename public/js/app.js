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

var user, friend;

function login(){
  var userName = $('.firstname').val();
  user = getUser(userName);
  var friendName = $('.friendfirstname').val();
  friend = new Friend (friendName);
  user.addFriend(friend);
}
$('startbutton').on('click', login);

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
