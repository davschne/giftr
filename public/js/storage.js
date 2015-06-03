var storage = {
  storeUser: function(user) {
    var friends = user.getAllFriends();
    localStorage.setItem(user.name, JSON.stringify(friends));
  },

  getUser: function(name) {
    var user = new User(name);
    var retrieved = localStorage.getItem(name);
    if (retrieved) {
      user.populateFriends(JSON.parse(retrieved));
    }
    return user;
  }
};

// Restoring a user will look a bit like this:
//
// var name = $('input').value;
// var user = storage.restoreUser(name);
// friendPane.showPeople();
// etc.
