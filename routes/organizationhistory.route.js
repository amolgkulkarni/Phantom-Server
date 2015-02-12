var organizationhistory = require('../controllers/organizationhistory.controller');

module.exports=function(app){

    app.route('/api/organizationhistory')
        .get(organizationhistory.list)
        .post(organizationhistory.create);

};