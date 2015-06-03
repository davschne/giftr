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

// Testing with variables listed below.
var user = new User("Me");
var friend = new Friend("Hana");
friend.gifts = [new Gift("pony"), new Gift("bulldozer")]
user.addFriend(friend);
user.addFriend(new Friend("David"));


// Create the panes
var friendPane = new FriendPane(user);
var mainPane = new MainPane();

function login() {
  var userName = $('.firstname').val();
  user = storage.getUser(userName);
  var friendPane = new FriendPane(user);
}

$('startbutton').on('click', login);

function FriendPane(user) {
  $list = $('.friendsList');
  var friends = user.getAllFriends();

  // populate list
  for (var name in friends) {
    if (friends.hasOwnProperty(name) && typeof friends[name] != "function") {
      $list.append('<li class="friend">' + friends[name].name + '</li>');
    }
  }

  // Add new friend
  $('.friendsHeader button').on('click', function() {
    $(this).hide();
    $list.append('<input type="text" id="new-friend" placeholder="Name"><button id="add">Add</button><button id="cancel">Cancel</button>');
    $('#new-friend').focus();

    // Confirm add
    $('#add').on('click', function() {
      var newFriend = new Friend($('#new-friend').val());
      user.addFriend(newFriend);
      $list.append('<li class="friend">' + newFriend.name + '</li>');
      removeAddField();
    });

    // Cancel add
    $('#cancel').on('click', removeAddField);
    storage.storeUser(user);
  });

  function removeAddField() {
    $('#new-friend').remove();
    $('#add').remove();
    $('#cancel').remove();
    $('.friendsHeader button').show();
  }

  // Select a friend
  $list.on('click', 'li:not(.highlight)', function() {
    deselectAll();
    $(this).addClass('highlight');
    $(this).append('<div class="editdelete"><button class="edit"><img src="images/edit.png"></button><button class="delete"><img src="images/delete.png"></button></div>');

    mainPane.enableGiftIdeasView(friends[$(this).text()]);

    // Delete button event listener
    $list.find('.delete').on("click", function(e) {
      e.preventDefault();
      $(this).parents('li').remove();
      // remove from friends
    });
  });

  function deselectAll() {
    $('.highlight')
      .removeClass('highlight')
      .children('.editdelete').remove();
  }
}
