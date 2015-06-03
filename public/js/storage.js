function Storage(uid) {
  var dbRef = 'https://incandescent-inferno-6099.firebaseio.com/users/' + uid;
  this.storeUser = function(user) {
    var name = user.name;
    var friends = user.getAllFriends();
    dbRef.child("friends").set(friends);
    dbRef.child("name").set(name);
  };
  this.getUser = function(snapshot) {
    var data = snapshot.val();
    var user = new User(data.name);
    user.populateFriends(data.friends);
    return user;
  };
};

// Restoring a user will look a bit like this:
//
// var name = $('input').value;
// var user = storage.restoreUser(name);
// friendPane.showPeople();
// etc.
