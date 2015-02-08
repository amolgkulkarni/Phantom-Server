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
            };
            res.status(404).send(error);
        }
    });
};

exports.read=function(req,res){
    res.send(req.employee);
};

exports.delete=function(req,res){
    var employee = req.employee;
    employee.remove(function(err){
        if(err){
            console.log(err);
            res.status(400).send(err.err);
        }
        else{
            res.send(employee);
        }
    })
};

exports.update=function(req,res){
    var employee = req.employee;
    for (var i in req.body) {
        employee[i] = JSON.parse(JSON.stringify(req.body[i]));
    }
    employee.save(function(err){
        if(err){
            console.log(err);
            res.status(400).send(err.err);
        }
        else{
            res.send(employee);
        }
    })

};