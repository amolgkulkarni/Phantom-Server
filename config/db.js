var env = process.env.ENV || 'dev';
var config = require('./config-'+env),
  mongoose = require('mongoose');

module.exports = function(){

  var db = mongoose.connect(config.db, function(err) {
    if (err) {
      console.error('Could not connect to MongoDB!');
      console.log(err);
    }
  });

  require('../models/dashboard.organizations.js');
    require('../models/dashboard.projects.js');
  return db;
}
