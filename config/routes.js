module.exports=function(app){


  require('../routes/organizations.route')(app);

  app.use('/api/*',function(req, res, next) {
    res.json({'error':'No Such Service Present'},404);
  });

  app.use('*',function(req, res, next) {
    res.send('<html><body><h1>404 Page Not Found</h1></body></html>',404);
  });



}