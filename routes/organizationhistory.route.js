var organizationhistory = require('../controllers/organizationhistory.controller');

module.exports=function(app){

    app.route('/api/organizationhistory')
        .get(organizationhistory.list)
        .post(organizationhistory.create);

    app.route('/api/organizationhistory/:orgId')
        .get(organizationhistory.read);
    app.param('orgId',organizationhistory.organizationHistoryById);

};