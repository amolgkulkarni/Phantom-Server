var projecthistory = require('../controllers/projecthistory.controller');

module.exports=function(app){

    app.route('/api/projecthistory')
        .get(projecthistory.list)
        .post(projecthistory.create);
    app.route('/api/projecthistory/:projId')
        .get(projecthistory.read);
    app.param('projId',projecthistory.projectHistoryById);

};