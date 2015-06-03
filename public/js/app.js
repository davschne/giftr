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
  
  buildFriendsList();
  listenForAdd();
  listenForSelect();

  // populate list
  function buildFriendsList() {
    for (var name in friends) {
      if (friends.hasOwnProperty(name) && typeof friends[name] != "function") {
        $list.append('<li class="friend">' + friends[name].name + '</li>');
      }
    }
    $('.addNewGift').hide();
  }

  // Add new friend
  function listenForAdd() {
    $('.friendsHeader button').on('click', function() {
      $(this).hide();
      $list.append('<input type="text" class="new-friend" placeholder="Name"><button id="add">Add</button><button id="cancel">Cancel</button>');
      $('.new-friend').focus();

      // Confirm add
      $('#add').on('click', function() {
        var newFriend = new Friend($('.new-friend').val());
        user.addFriend(newFriend);
        $list.append('<li class="friend">' + newFriend.name + '</li>');
        removeAddField();
      });

      // Cancel add
      $('#cancel').on('click', removeAddField);
      storage.storeUser(user);
    });

    function removeAddField() {
      $('.new-friend').remove();
      $('#add').remove();
      $('#cancel').remove();
      $('.friendsHeader button').show();
    }
  }

  // Select a friend
  function listenForSelect() {
    $list.on('click', 'li:not(.highlight)', function() {
      deselectAll();
      $(this).addClass('highlight');
      $(this).append('<div class="editdelete"><button class="edit"><img src="images/edit.png"></button><button class="delete"><img src="images/delete.png"></button></div>');

      mainPane.enableGiftIdeasView(friends[$(this).text()]);

      // Edit button event listener
      $list.find('.edit').on("click", function() {
        $item = $(this).parents('li');
        var cachedItem = $item.text();
        $item.replaceWith('<span class="edit-item"><input type="text" class="new-friend" value="' + cachedItem + '"><button id="add-friend">Save</button><button id="cancel-friend">Cancel</button></span>');
        $('.new-friend').focus();

        // Confirm edit
        $('#add-friend').on('click', function() {
          var $newFriend = $('.new-friend').val();
          if (cachedItem != $newFriend) {
            friends[cachedItem] = $newFriend;
          }
          // Modify list
          $('ul .edit-item').replaceWith('<li><span class="friend">' + $newFriend + '</span></li>');
        });

        // Cancel edit
        $('#cancel-friend').on('click', function() {
          $('ul .edit-item').replaceWith('<li><span class="friend">' + cachedItem + '</span></li>')
          $('.mainHeader button').show();
        });
      });

      // Delete button event listener
      $list.find('.delete').on("click", function(e) {
        e.preventDefault();
        user.removeFriend($(this).parents('li').text());
        $(this).parents('li').remove();
      });
    });
  }

  function deselectAll() {
    $('.highlight')
      .removeClass('highlight')
      .children('.editdelete').remove();
  }
}
