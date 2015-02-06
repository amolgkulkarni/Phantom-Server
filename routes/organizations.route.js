var organizations = require('../controllers/organizations.controller');

module.exports=function(app){

    app.route('/api/organizations')
        .get(organizations.list)
        .post(organizations.create);

    app.route('/api/organizations/:orgId')
        .get(organizations.read)
        .put(organizations.update)
        .delete(organizations.delete);

    app.param('orgId',organizations.organizationById);

};