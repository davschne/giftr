$(function() {

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

  function Storage(uid) {

    var dbRef = new Firebase('https://incandescent-inferno-6099.firebaseio.com/users/' + uid);

    this.storeUser = function(user) {
      var name = user.name;
      var friends = user.getAllFriends();
      dbRef.set({friends: friends});
    };

    this.getUser = function(snapshot) {
      var data = snapshot.val().users[uid];
      var user = new User(data.name);
      user.populateFriends(data.friends);
      return user;
    };
  };

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
        deselectAll('.friendsList');
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
        deselectAll('.friendsList');
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
  }

  function deselectAll(parentElement) {
    $(parentElement + ' .highlight')
      .removeClass('highlight')
      .children('.editdelete').remove();
  }

  function MainPane() {
    this.clear = function() {
      $('.main-pane').empty();
    };
    this.enableGiftIdeasView = function(friend) {
      var $list;

      buildList();
      listenForSelect();
      listenForAdd();

      function buildList() {
        // Create list of gifts from Friend object
        $('.addNewGift').show();
        $list = $('<ul class="mainList"></ul>');
        for (var i = 0; i < friend.gifts.length; i++) {
          $list = $list.append('<li><span class="gift">' + friend.gifts[i].name + '</span></li>');
        }
        // Put it in the DOM
        $('.main-pane ul').replaceWith($list);
      }

      function listenForSelect() {
        // Select gift idea
        $list.on("click", "li:not(.highlight)", function() {
          deselectAll('.mainList');
          $(this).addClass("highlight")
                 .append('<div class="editdelete"><button class="edit"><img src="images/edit.png"></button><button class="delete"><img src="images/delete.png"></button></div>');

          // Edit button event listener
          $(this).find('.edit').on("click", function() {
            $item = $(this).parents('li');
            var cachedItem = $item.text();
            $item.replaceWith('<span class="edit-item"><input type="text" id="new-gift" value="' + $item.children('.gift').text() + '"><button id="add-gift">Save</button><button id="cancel-gift">Cancel</button></span>');
            $('#new-gift').focus();

            // Confirm edit
            $('#add-gift').on('click', function() {
              var $gift = $('#new-gift').val();
              if (cachedItem != $gift) {
                for (var i = 0; i < friend.gifts.length; i++) {
                  if (friend.gifts[i].name == cachedItem) {
                    friend.gifts[i].name = $gift;
                  }
                }
              }
              storage.storeUser(user);

              // Modify list
              $('ul .edit-item').replaceWith('<li><span class="gift">' + $gift + '</span></li>');
            });

            // Cancel edit
            $('#cancel-gift').on('click', function() {
              $('ul .edit-item').replaceWith('<li><span class="gift">' + cachedItem + '</span></li>')
              $('.mainHeader button').show();
            });
          });

          // Delete button event listener
          $list.find('.delete').on("click", function() {
            for (var i = 0; i < friend.gifts.length; i++) {
              if (friend.gifts[i].name == $(this).parents('li').text()) {
                friend.gifts.splice(i, 1);
              }
            }
            storage.storeUser(user);
            $(this).parents('li').remove();
          });
        });
      }

      function listenForAdd() {
        // Add a new gift idea
        $('.mainHeader button').on("click", function() {
          $(this).hide();
          deselectAll('.mainList');
          // Create form field, edit & delete buttons
          $list.append('<span class="edit-item"><input type="text" id="new-gift" placeholder="new gift idea"><button id="add-gift">Add</button><button id="cancel-gift">Cancel</button></span>');
          $('#new-gift').focus();

          // Confirm add
          $('#add-gift').on('click', function() {
            var entry = $('#new-gift').val();
            if (!entry) {
              cancelAdd();
            }
            var gift = new Gift($('#new-gift').val());

            // Save gift to friend object
            friend.gifts.push(gift);
            storage.storeUser(user);

            // Replace controls with list item
            $('.mainList .edit-item').replaceWith('<li><span class="gift">' + gift.name + '</span></li>');
            $('.mainHeader button').show();
          });

          // Cancel add
          $('#cancel-gift').on('click', cancelAdd);
        });
      }

      function cancelAdd() {
        $('.mainList .edit-item').remove();
        $('.mainHeader button').show();
      }
    };
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
      storage = new Storage(authData.uid);
      ref.once('value', function(snapshot) {

        // Create the user object

        user = storage.getUser(snapshot);
        console.log(user);

        // Start the application!

        giftr(user);
      });
    }
  }

  function start() {

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

  function enableLogoutListener() {
    $('.accountButtons').on('click', function() {
      ref.unauth();
      $('#container').load('index.html #landing', function() {
        start();
      });
    });
  }

  function giftr(user) {

    // Replace <section>

    $('#container').load('main.html', function() {

      // Create the panes

      friendPane = new FriendPane(user);
      mainPane = new MainPane();
      enableLogoutListener();
    });
  }

  var ref = new Firebase('https://incandescent-inferno-6099.firebaseio.com/');
  var user;
  var storage;
  var friendPane;
  var mainPane;
  start();
});
