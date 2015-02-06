/**
 * Created by sharadau on 2/5/2015.
 */
var mongoose = require('mongoose'),
    Employees = mongoose.model('Employees');

exports.list=function(req,res,next){

    Employees.find(function(err, employees){
        if(err){
            next(err);
        }
         res.send(employees);
    })
};

exports.create=function(req,res){
    var employee = new Employees (req.body);
    employee.save(function(err){
        if(err){
            res.status(400).send(err.err);
        }
        else{
            res.send(employee);
        }
    })
};

exports.employeeById=function(req,res,next,id){

    Employees.findOne({_id:id},function(err,employee){
        if(err){
            next(err);
        }
        if(employee){
            req.employee=employee;
            next();
        }
        else{
            var error={
                error:"Todo not found"
            }
            res.status(404).send(error);
        }
    });
};
