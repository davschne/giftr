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



var ref = new Firebase('https://incandescent-inferno-6099.firebaseio.com/');
var user;

$('.startbutton').on('click', function() {
  var userName = $('.firstname').val();
  var password = "password";
  console.log('start button clicked!');
  ref.createUser({
    'email': userName,
    'password': password
  }, createUser);
});

var createUser = function(error, userData) {
  if (error) {
    switch (error.code) {
      case "EMAIL_TAKEN":
        console.log("The new user account cannot be created because the email is already in use.");
        break;
      case "INVALID_EMAIL":
        console.log("The specified email is not a valid email.");
        break;
      default:
        console.log("Error creating user:", error);
    }
  } else {
    console.log("Successfully created user account with uid:", userData.uid);
    ref.child('users').set(userData.uid);
  }
};


$('.loginButton').on('click', function() {
  console.log("button pressed");
  var userLogin = $('.userLogin').val();
  var password = "password";
  ref.authWithPassword({
    'email': userLogin,
    'password': password
  }, authenticate);
});

var authenticate = function(error, authData) {
  if(error) {
    switch(error.code) {
    case "INVALID_EMAIL":
      console.log("The specified user account email is invalid.");
      break;
    case "INVALID_PASSWORD":
      console.log("The specified user account password is incorrect.");
      break;
    case "INVALID_USER":
      console.log("The specified user account does not exist.");
      break;
    default:
      console.log("Error logging user in:", error);
      }
  } else {
    console.log("Authenticated successfully with payload:", authData);
    console.log(authData.uid);
    // var userRef = ref.
    var storage = new Storage(authData.uid);
    storage.storeUser(me);
    ref.once('value', function(snapshot) {
      user = storage.getUser(snapshot);
      console.log(user);
    });

  }
}
