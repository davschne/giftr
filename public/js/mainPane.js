//  ----------
// | MainPane |
//  ----------
//   Methods:

//     clear()
//     enableGiftIdeasView(friend)
//       - use friend to populate the list of gifts
//       - enable event listeners (can modify friend.gifts)
//       - may want some internal functions to deal with the interface for adding gifts, reordering list, (and anything else)

function MainPane() {
  this.clear = function() {
    $('.main-pane').empty();
  };
  this.enableGiftIdeasView = function(friend) {

    var $list;

    function addGift();

    // Create list of gifts from Friend object
    $list = $('<ul class="mainList"></ul>');
    for (var i = 0; i < friend.gifts.length; i++) {
      $list = $list.append('<li>' + friend.gifts[i] + '</li>');
    }
    // Put it in the DOM
    $('.main-pane ul').replaceWith($list);

    // Enable event listeners:

    // Add gift idea
    // $('#add-gift').on("click", function() {
    //   this.preventDefault();
    //   $
    // })
/*
    $('.addFriend').on('click', function() {
    $list.append('<input type="text" id="new-friend" placeholder="Name" autofocus /><button id="add">Add</button>');
    $('#add').on('click', function() {
      this.addFriend($('#new-friend').val());
      $('#new-friend').remove();
      $('#add').remove();
    });

  this.addFriend = function(friend) {
    $list.append('<li>' + friend + '</li>');
  };
*/

    // Select gift idea

    // Delete gift idea
  };
}
