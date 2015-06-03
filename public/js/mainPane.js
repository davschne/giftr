function MainPane() {
  this.clear = function() {
    $('.main-pane').empty();
  };
  this.enableGiftIdeasView = function(friend) {

    var $list;

    // function addGift();

    // Create list of gifts from Friend object
    $list = $('<ul class="mainList"></ul>');
    for (var i = 0; i < friend.gifts.length; i++) {
      $list = $list.append('<li><span class="gift">' + friend.gifts[i].name + '</span></li>');
    }
    // Put it in the DOM
    $('.main-pane ul').replaceWith($list);

    // Enable event listeners:

    // Add gift idea

    $('#add-gift').on("click", function(e) {
      e.preventDefault();

      // Create form field, edit & delete buttons
      $list.append('<input type="text" id="new-gift" placeholder="new gift idea" autofocus /><button id="save-gift">Add</button><button id="cancel-gift">Cancel</button>');

      $('#save-gift').on('click', function() {
        var gift = new Gift($('#new-gift').val());

        // Save gift to friend object
        friend.gifts.push(gift);

        // Append to list
        $list.append('<li><span class="gift">' + gift.name + '</span></li>');
        removeAddField();
      });

      $('#cancel').on('click', removeAddField);
      storage.storeUser(user);
      $list.append('<button id="add-gift">Add</button>');
    });

    function removeAddField() {
      $('#new-gift').remove();
      $('#add').remove();
      $('#cancel').remove();
      $('.addFriend').show();
    }

    // Select gift idea

    $('.mainList').on("click", "li:not(.highlight)", function() {
      // console.log("click on li: " + this);
      deselectAll();
      $(this).addClass("highlight")
             .append('<button class="edit" id="edit-gift">Edit</button><button class="delete" id="delete-gift">Delete</button>');

      // Edit button event listener
      $('#edit-gift').on("click", function(e) {
        e.preventDefault();
        // console.log("click on edit button");
        $item = $(this).parents('li');
        $item.replaceWith('<input type="text" id="new-gift" value="' + $item.children('.gift').text() + '" autofocus /><button></button>');
      });

      // Delete button event listener
      $('#delete-gift').on("click", function(e) {
        e.preventDefault();
        console.log("click on delete button");
        $(this).parents('li').remove();
      });

    });

    // function select();

    function deselectAll() {
      $('.highlight')
        .removeClass('highlight')
        .children('button').remove();
    }
  };
}
