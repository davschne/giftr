var ref = new Firebase('https://incandescent-inferno-6099.firebaseio.com/');
var usersRef = ref.child('users');

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
  }
}

