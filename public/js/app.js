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
      $('.friends-pane .add').on('click', function() {
        $(this).hide();
        deselectAll('.friendsList');
        $('.addNewGift').hide();
        $('.mainList').empty();
        $list.append('<input type="text" class="new-friend" placeholder="Name"><button id="add-friend">Add</button><button id="cancel">Cancel</button>');
        $('.new-friend').focus();

        // Confirm add
        $('#add-friend').on('click', function() {
          var newFriend = new Friend($('.new-friend').val());
          user.addFriend(newFriend);
          var $parent = $list.append('<li class="friend">' + newFriend.name + '</li>');
          var $current = $parent.children().last();
          removeAddField();
          $current.addClass('highlight');
          
          mainPane.enableGiftIdeasView(friends[$current.text()]);
        });

        // Cancel add
        $('#cancel').on('click', removeAddField);
      });

      function removeAddField() {
        $('.new-friend').remove();
        $('#add-friend').remove();
        $('#cancel').remove();
        $('.friends-pane .add').show();
      }
    }

    // Select a friend
    function listenForSelect() {
      function cancelEdit(cachedItem) {
        $('ul .edit-item').replaceWith('<li><span class="friend">' + cachedItem + '</span></li>');
        $('.main-pane .add').show();
      }

      $list.on('click', 'li:not(.highlight)', function() {
        deselectAll('.friendsList');
        $(this).addClass('highlight');
        mainPane.enableGiftIdeasView(friends[$(this).text()]);
      });

      $('.friendsList').on('mouseenter', 'li', function() {
        $(this).append('<div class="editdelete"><button class="edit"><img src="images/edit.png"></button><button class="delete"><img src="images/delete.png"></button></div>');

        // Edit button event listener
        $list.find('.edit').on("click", function() {
          $item = $(this).parents('li');
          var cachedItem = $item.text();
          $item.replaceWith('<span class="edit-item"><input type="text" id="new-friend" value="' + cachedItem + '"><button id="add-friend">Save</button><button id="cancel-friend">Cancel</button></span>');
          $('#new-friend').focus();

          // Click anywhere on page to cancel edit
          $('.container').on('click', ':not(.friend-pane .highlight)', function() {
            cancelEdit(cachedItem);
          });

          // Confirm edit
          $('#add-friend').on('click', function() {
            var $newFriend = $('#new-friend').val();
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
            cancelEdit(cachedItem);
          });
        });

        // Delete button event listener
        $list.find('.delete').on("click", function(e) {
          e.preventDefault();
          user.removeFriend($(this).parents('li').text());
          $(this).parents('li').remove();
          $('.mainList').empty();
        });
        
        $('.friendsList').one('mouseleave', 'li', function() {
          $(this).children('.editdelete').remove();
        });
      });
    }
  }

  function deselectAll(parentElement) {
    $(parentElement + ' .highlight')
      .removeClass('highlight');
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
        $('.main-pane .add').show();
        $list = $('<ul class="mainList"></ul>');
        if (!friend.gifts) {
          friend.gifts = [];
        }
        for (var i = 0; i < friend.gifts.length; i++) {
          $list = $list.append('<li><span class="gift">' + friend.gifts[i].name + '</span></li>');
        }
        // Put it in the DOM
        $('.main-pane ul').replaceWith($list);
      }

      function listenForAdd() {
        // Add a new gift idea
        $('.main-pane .add').on("click", function() {
          $(this).hide();
          deselectAll('.mainList');
          // Create form field, edit & delete buttons
          $('.mainList').append('<span class="edit-item"><input type="text" id="new-gift" placeholder="new gift idea"><button id="add-gift">Add</button><button id="cancel-gift">Cancel</button></span>');
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
            $('.main-pane .add').show();
          });

          // Cancel add
          $('#cancel-gift').on('click', cancelAdd);
        });
      }

      function listenForSelect() {
        function cancelEdit(cachedItem) {
          $('ul .edit-item').replaceWith('<li><span class="gift">' + cachedItem + '</span></li>');
          $('.main-pane .add').show();
        }
        // Select gift idea
        $list.on("click", "li:not(.highlight)", function() {
          deselectAll('.mainList');
          $(this).addClass("highlight");
        });


        $('.mainList').on('mouseenter', 'li', function() {
          $(this).append('<div class="editdelete"><button class="edit"><img src="images/edit.png"></button><button class="delete"><img src="images/delete.png"></button></div>');
          // Edit button event listener
          $(this).find('.edit').on("click", function() {
            $item = $(this).parents('li');
            // Store item in case of cancel
            var cachedItem = $item.text();
            $item.replaceWith('<span class="edit-item"><input type="text" id="new-gift" value="' + $item.children('.gift').text() + '"><button id="edit-gift">Save</button><button id="cancel-edit-gift">Cancel</button></span>');
            $('#new-gift').focus();
            // Event listener: remove edit controls if user clicks anywhere else
            $('.container').on('click', ':not(.edit-item.find("*")', function() {
              cancelEdit(cachedItem);
            });

            // Confirm edit
            $('#edit-gift').on('click', function() {
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
            $('#cancel-edit-gift').on('click', function() {
              cancelEdit(cachedItem);
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
          
          $('.mainList').on('mouseleave', 'li', function() {
            $(this).children('.editdelete').remove();
          });
        });
      }  

      function cancelAdd() {
        $('.mainList .edit-item').remove();
        $('.main-pane .add').show();
      }
    };
  }

  function createUser(error, userData, email) {
    if (error) {
      var message;
      switch (error.code) {
        case "EMAIL_TAKEN":
          message = "The new user account cannot be created because the email is already in use.";
          break;
        case "INVALID_EMAIL":
          message = "The specified email is not a valid email.";
          break;
        default:
          message = "Error creating user";
      }

      $('#create-error').text(message);

    } else {
      ref.child('users').child(userData.uid).set({name: email});
      authenticate(null, userData);
    }
  };

  function authenticate(error, authData) {
    if (error) {
      var message;
      switch(error.code) {
        case "INVALID_EMAIL":
          message = "The specified user account email is invalid.";
          break;
        case "INVALID_PASSWORD":
          message = "The specified user account password is incorrect.";
          break;
        case "INVALID_USER":
          message = "The specified user account does not exist.";
          break;
        default:
          message = "Error logging user in";
      }

      $('#login-error').text(message);

    } else {
      storage = new Storage(authData.uid);
      ref.once('value', function(snapshot) {

        // Create the user object

        user = storage.getUser(snapshot);

        // Start the application!

        giftr(user);
      });
    }
  }

  function start() {

    // Log in as existing user

    $('#existing-user-button').on('click', function(e) {
      e.preventDefault();
      var email = $('#email-existing').val();
      var password = $('#password-existing').val();
      ref.authWithPassword({
        'email': email,
        'password': password
      }, authenticate);
    });

    // Create new account

    $('#create-user-button').on('click', function(e) {
      e.preventDefault();
      var email = $('#email-new').val();
      var password = $('#password-new').val();
      ref.createUser({
        'email': email,
        'password': password
      }, function(error, userData) {
        createUser(error, userData, email);
      });
    });
  }

  function enableLogoutListener() {
    $('#log-out').on('click', function() {
      ref.unauth();
      $('body').load('index.html #landing', function() {
        start();
      });
    });
  }

  function giftr(user) {

    // Replace <section>

    $('body').load('main.html', function() {

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
