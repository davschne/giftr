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
      storage.storeUser(this);
      return true;
    } else {
      return false;
    }
  };

  this.removeFriend = function(name) {
    if (friends[name]) {
      delete friends[name];
      storage.storeUser(this);
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
    friends = object || {};
  };
}

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
      deselectAll();
      $('.addNewGift').hide();
      $('.mainList').empty();
      $list.append('<input type="text" class="new-friend" placeholder="Name"><button id="add">Add</button><button id="cancel">Cancel</button>');
      $('.new-friend').focus();

      // Confirm add
      $('#add').on('click', function() {
        var newFriend = new Friend($('.new-friend').val());
        user.addFriend(newFriend);
        var $parent = $list.append('<li class="friend">' + newFriend.name + '</li>');
        var $current = $parent.children().last();
        removeAddField();
        $current.addClass('highlight');
        $current.append('<div class="editdelete"><button class="edit"><img src="images/edit.png"></button><button class="delete"><img src="images/delete.png"></button></div>');

        mainPane.enableGiftIdeasView(friends[$current.text()]);
      });

      // Cancel add
      $('#cancel').on('click', removeAddField);
      // storage.storeUser(user);
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
            var editFriend = new Friend($newFriend);
            editFriend.gifts = friends[cachedItem].gifts;
            user.addFriend(editFriend);
            user.removeFriend(cachedItem);
            $('.mainList').empty();
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
        $('.mainList').empty();
      });
    });
  }

  function deselectAll() {
    $('.friendsList .highlight')
      .removeClass('highlight')
      .children('.editdelete').remove();
  }
}

function createUser(error, userData, email) {
  if (error) {
    switch (error.code) {
      case "EMAIL_TAKEN":
        console.log("The new user account cannot be created because the email is already in use.");
        break;
      case "INVALID_EMAIL":
        console.log("The specified email is not a valid email.");
        break;
      default:
        console.log("Error creating user:", error);
    }
  } else {
    // console.log("Successfully created user account with uid:", userData.uid);
    // console.log(userData);

    // var object = {
    //   userData.uid:
    //   {"name": userData.password.email}};
    // console.log("email : " + email);
    ref.child('users').set(userData.uid);
    ref.child('users').child(userData.uid).set({name: email});
    authenticate(null, userData);
  }
};

function authenticate(error, authData) {
  if (error) {
    switch(error.code) {
    case "INVALID_EMAIL":
      console.log("The specified user account email is invalid.");
      break;
    case "INVALID_PASSWORD":
      console.log("The specified user account password is incorrect.");
      break;
    case "INVALID_USER":
      console.log("The specified user account does not exist.");
      break;
    default:
      console.log("Error logging user in:", error);
      }
  } else {
    // console.log("Authenticated successfully with payload:", authData);
    // console.log(authData.password.email);
    // var userRef = ref.
    // storage.storeUser(me);

    storage = new Storage(authData.uid);
    ref.once('value', function(snapshot) {
      // console.log(snapshot.val().users[authData.uid]);
      user = storage.getUser(snapshot);
      // console.log(user);
      giftr(user);
    });
  }
}

// Testing with variables listed below.
// var user = new User("Me");
// var friend = new Friend("Hana");
// friend.gifts = [new Gift("pony"), new Gift("bulldozer")]
// user.addFriend(friend);
// user.addFriend(new Friend("David"));

function enableLoginListeners() {

  // Log in as existing user

  $('.loginButton').on('click', function() {
    var userLogin = $('.userLogin').val();
    var password = "password";
    ref.authWithPassword({
      'email': userLogin,
      'password': password
    }, authenticate);
  });

  // Create new account

  $('.startbutton').on('click', function() {
    var email = $('.firstname').val();
    var password = "password";
    ref.createUser({
      'email': email,
      'password': password
    }, function(error, userData) {
      createUser(error, userData, email);
    });
  });
}

function start() {
  $('.main').hide();
  enableLoginListeners();
}

function giftr(user) {
  $('.landing').hide();
  $('.main').show();
  // Create the panes
  friendPane = new FriendPane(user);
  mainPane = new MainPane();
}

var ref = new Firebase('https://incandescent-inferno-6099.firebaseio.com/');
var user;
var storage;
var friendPane;
var mainPane;
start();

