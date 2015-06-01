var express = require('express');
var app = express();

app.use(express.static('public'));
app.set('port', (process.env.PORT || 5000));

app.listen((process.env.PORT || 5000), function() {
  console.log("This server is running on port " + app.get('port'));
});
