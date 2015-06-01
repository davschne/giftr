var fred = new Friend("Fred");
var mom = new Friend("Mom");
var dad = new Friend("Dad");

var sweater = new Gift("sweater");
var pony = new Gift("pony");
var bbgun = new Gift("bbgun");

var me = new User("Me");

fred.sweater = sweater;
mom.pony = pony;
dad.pony = pony;
dad.bbgun = bbgun;

console.assert(me.addFriend(fred));
console.assert(me.addFriend(mom));
console.assert(!me.addFriend("Sally"));

console.assert(me.getFriend("Mom") == mom);
console.assert(!me.getFriend("Dad"));

console.log(me.keys());

console.assert(me.removeFriend("Mom"));
console.assert(!me.removeFriend("Alice"));

console.log(me.keys());
