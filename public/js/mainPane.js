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
        deselectAll();
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
            // Modify list
            $('ul .edit-item').replaceWith('<li><span class="gift">' + $gift + '</span></li>');
          });

          // Cancel edit
          $('#cancel-gift').on('click', function() {
            $('ul .edit-item').replaceWith('<li><span class="gift">' + cachedItem + '</span></li>')
            $('.mainHeader button').show();
          });

          // storage.storeUser(user);

          // TODO: modify entry in friend.gifts
        });

        // Delete button event listener
        $list.find('.delete').on("click", function() {
          for (var i = 0; i < friend.gifts.length; i++) {
            if (friend.gifts[i].name == $(this).parents('li').text()) {
              friend.gifts.splice(i, 1);
            }
          }
          $(this).parents('li').remove();
        });
      });
    }

    function listenForAdd() {
      // Add a new gift idea
      $('.mainHeader button').on("click", function() {
        $(this).hide();

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

          // Replace controls with list item
          $('.mainList .edit-item').replaceWith('<li><span class="gift">' + gift.name + '</span></li>');
          $('.mainHeader button').show();
        });

        // Cancel add
        $('#cancel-gift').on('click', cancelAdd);

        // COMMIT TO STORAGE?
        storage.storeUser(user);
      });
    }

    function cancelAdd() {
      $('.mainList .edit-item').remove();
      $('.mainHeader button').show();
    }

    function deselectAll() {
      $('.highlight')
        .removeClass('highlight')
        .children('.editdelete').remove();
    }
  };
}
