/**
 * Created by sharadau on 2/5/2015.
 */
var employees = require('../controllers/employees.controller');

module.exports=function(app){

    app.route('/api/employees')
        .get(employees.list)
        .post(employees.create);

    app.param('empId',employees.employeeById);

};