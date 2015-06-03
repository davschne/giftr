var fred = new Friend("Fred");
var mom = new Friend("Mom");
var dad = new Friend("Dad");

var sweater = new Gift("sweater");
var pony = new Gift("pony");
var bbgun = new Gift("bbgun");

var me = new User("Me");

fred.sweater = sweater;
mom.gifts.push(pony);
dad.gifts.push(pony);
dad.gifts.push(bbgun);

// Tests for User, Friend, Gift objects

console.assert(me.addFriend(fred));
console.assert(me.addFriend(mom));
console.assert(!me.addFriend("Sally"));

console.assert(me.getFriend("Mom") == mom);
console.assert(!me.getFriend("Dad"));

console.log(me.keys() + " == Fred,Mom");

console.assert(me.removeFriend("Mom"));
console.assert(!me.removeFriend("Alice"));

console.log(me.keys() + " == Fred");


// Tests for Storage object

var firebase = new Firebase('https://incandescent-inferno-6099.firebaseio.com/');
firebase.set("testUser");

var storage = new Storage(firebase.child("testUser"));
storage.storeUser(me);

dbRef.once("value", function(snapshot) {
  var data = snapshot.val();
  var user = new User(data.name);
  user.populateFriends(data.friends);
  return user;
}, function(errorObject) {
  console.log("Error retrieving data: " + errorObject.code);
});

var you = storage.getUser();
console.log(you);
console.log(you.keys() + " == " + me.keys());

var mainPane = new MainPane();
mainPane.enableGiftIdeasView(dad);
