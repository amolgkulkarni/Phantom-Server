/**
 * Created by sharadau on 2/5/2015.
 */
var mongoose = require('mongoose'),
    Employees = mongoose.model('Employees'),
    Projects = mongoose.model('Projects');

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
    // TODO: Add to project

    var newProjects = req.body.projects || [];

    for (idx = 0; idx < newProjects.length; idx ++){
        // add this employee to project.employees
        Projects.findOne({name:newProjects[idx]},function(err,project){
            if(err){
                next(err);
            }
            if(project){
                project.employees.push(employee.name);

                project.save(function(err){
                    if(err){
                        console.log(err);
                        //res.status(400).send(err.err);
                    }
                    else{
                        //res.send(employee);
                    }
                });
            }
            else{
                var error={
                    error:"Project not found"
                };
                //res.status(404).send(error);
            }
        });
    }

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
    // TODO remove from project
    var oldProjects = employee.projects || [];
    for (var idx = 0; idx < oldProjects.length; idx ++){
        // remove this employee from project.employees
        Projects.findOne({name:oldProjects[idx]},function(err,project){
            if(err){
                next(err);
            }
            if(project){
                project.employees.splice(project.employees.indexOf(employee.name),1);

                project.save(function(err){
                    if(err){
                        console.log(err);
                        //res.status(400).send(err.err);
                    }
                    else{
                        //res.send(employee);
                    }
                });
            }
            else{
                var error={
                    error:"Project not found"
                };
                //res.status(404).send(error);
            }
        });
    }

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
    var newEmployee = req.body;

    // req.body is new data while employee is old data
    var oldProjects = employee.projects || [];
    var newProjects = req.body.projects || [];
    var idx = 0;
    for (idx = 0; idx < oldProjects.length; idx ++){
        if (-1 === newProjects.indexOf(oldProjects[idx])){
            // remove this employee from project.employees
                Projects.findOne({name:oldProjects[idx]},function(err,project){
                    if(err){
                        next(err);
                    }
                    if(project){
                        project.employees.splice(project.employees.indexOf(newEmployee.name),1);

                        project.save(function(err){
                            if(err){
                                console.log(err);
                                //res.status(400).send(err.err);
                            }
                            else{
                                //res.send(employee);
                            }
                        });
                    }
                    else{
                        var error={
                            error:"Project not found"
                        };
                        //res.status(404).send(error);
                    }
                });
        }
    }
    for (idx = 0; idx < newProjects.length; idx ++){
        if (-1 === oldProjects.indexOf(newProjects[idx])){
            // add this employee to project.employees
            Projects.findOne({name:newProjects[idx]},function(err,project){
                if(err){
                    next(err);
                }
                if(project){
                    project.employees.push(newEmployee.name);

                    project.save(function(err){
                        if(err){
                            console.log(err);
                            //res.status(400).send(err.err);
                        }
                        else{
                            //res.send(employee);
                        }
                    });
                }
                else{
                    var error={
                        error:"Project not found"
                    };
                    //res.status(404).send(error);
                }
            });
        }
    }


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