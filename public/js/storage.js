function Storage(uid) {

  var dbRef = new Firebase('https://incandescent-inferno-6099.firebaseio.com/users/' + uid);

  this.storeUser = function(user) {
    var name = user.name;
    var friends = user.getAllFriends();
    // console.log(friends);
    dbRef.set({friends: friends});
    // dbRef.child("name").set(name);
  };

  this.getUser = function(snapshot) {
    var data = snapshot.val().users[uid];
    // console.log(uid);
    // console.log(data);
    var user = new User(data.name);
    console.log(data.friends);
    user.populateFriends(data.friends);
    return user;
  };
};
