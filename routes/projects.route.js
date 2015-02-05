/**
 * Created by sharadau on 2/5/2015.
 */
var projects = require('../controllers/projects.controller');

module.exports=function(app){

    app.route('/api/projects')
        .get(projects.list)
        .post(projects.create);

//    app.route('/api/organizations/:orgId')
//        .get(organizations.read)
//        .put(organizations.update)
//        .delete(organizations.delete);

    app.param('prjId',projects.projectById);

};