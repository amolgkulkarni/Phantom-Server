var PORT = (process.env.PORT || 3000);
var db = require('./config/db')();
var app = require('./config/express')();

//Configure express routes
require('./config/routes.js')(app);

app.listen(PORT,function(){
   console.log('listening on port '+PORT);
});
