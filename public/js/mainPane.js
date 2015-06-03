function MainPane() {
  this.clear = function() {
    $('.main-pane').empty();
  };
  this.enableGiftIdeasView = function(friend) {

    var $list;

    // Create list of gifts from Friend object
    $list = $('<ul class="mainList"></ul>');
    for (var i = 0; i < friend.gifts.length; i++) {
      $list = $list.append('<li><span class="gift">' + friend.gifts[i].name + '</span></li>');
    }
    // Put it in the DOM
    $('.main-pane ul').replaceWith($list);

    // Enable event listeners:

    // Add a new gift idea
    $('.mainHeader button').on("click", function() {
      $(this).hide();

      // Create form field, edit & delete buttons
      $list.append('<input type="text" id="new-gift" placeholder="new gift idea"><button id="add-gift">Add</button><button id="cancel-gift">Cancel</button>');
      $('#new-gift').focus();

      // Confirm add
      $('#add-gift').on('click', function() {
        var gift = new Gift($('#new-gift').val());

        // Save gift to friend object
        friend.gifts.push(gift);

        // Append to list
        $list.append('<li><span class="gift">' + gift.name + '</span></li>');
        removeAddField();
      });

      // Cancel add
      $('#cancel-gift').on('click', removeAddField);
      storage.storeUser(user);
    });

    function removeAddField() {
      $('#new-gift').remove();
      $('#add-gift').remove();
      $('#cancel-gift').remove();
      $('.mainHeader button').show();
    }

    // Select gift idea

    $('.mainList').on("click", "li:not(.highlight)", function() {
      // console.log("click on li: " + this);
      deselectAll();
      $(this).addClass("highlight")
             .append('<div class="editdelete"><button class="edit"><img src="images/edit.png"></button><button class="delete"><img src="images/delete.png"></button></div>');

      // Edit button event listener
      $('#edit-gift').on("click", function(e) {
        e.preventDefault();
        // console.log("click on edit button");
        $item = $(this).parents('li');
        $item.replaceWith('<input type="text" id="new-gift" value="' + $item.children('.gift').text() + '" autofocus /><button></button>');
        // modify entry in friend.gifts
      });

      // Delete button event listener
      $('.mainList .delete').on("click", function(e) {
        e.preventDefault();
        $(this).parents('li').remove();
        // remove from friend.gifts
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
