/**
 * Created by sharadau on 2/5/2015.
 */
var mongoose = require('mongoose'),
    Projects = mongoose.model('Projects'),
    Employees = mongoose.model('Employees'),
   ProjectHistory = mongoose.model('ProjectHistory'),
    Organizations = mongoose.model('Organizations');

exports.list=function(req,res,next){

    Projects.find(function(err, projects){
        if(err){
            next(err);
        }
         res.send(projects);
    })
};

exports.create=function(req,res){
    var projects = new Projects (req.body);
    // TODO: Add to Employee

    var newEmployees = req.body.employees || [];

    for (idx = 0; idx < newEmployees.length; idx ++){
        // add this employee to project.employees
        Employees.findOne({name:newEmployees[idx]},function(err,employee){
            if(err){
                next(err);
            }
            if(employee){
                employee.projects.push(projects.name);

                employee.save(function(err){
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
                    error:"Employee not found"
                };
                //res.status(404).send(error);
            }
        });
    }


    //add this project to new organization
    if (projects.organization) {
      Organizations.findOne({name:projects.organization},function(err,org){
          org.projects.push(projects.name);
          org.save(function(err){ });
      });
    }



    projects.save(function(err){
        if(err){
            res.status(400).send(err.err);
        }
        else{
            res.send(projects);
        }
    })
};

exports.projectById=function(req,res,next,id){
    Projects.findOne({_id:id},function(err,project){
        if(err){
            next(err);
        }
        if(project){
            // Get History
            ProjectHistory.find({projId: project._id}, {}, {skip:0, limit:10, sort:{'created': 1}},
                function(err, projHistory){
                    var resProj = {};
                    var historyLen = projHistory ? projHistory.length: 0;
                    resProj.billable = [];
                    resProj.bench = [];
                    resProj.total = [];
                    resProj.labels = [];
                    for (var idx= 0; idx < historyLen; idx++) {
                        resProj.billable.push(projHistory[idx].billable);
                        resProj.bench.push(projHistory[idx].bench);
                        resProj.total.push(projHistory[idx].total);
                        resProj.labels.push(projHistory[idx].created);
                    }

                    resProj.employees = project.employees;
                    resProj._id = project._id;
                    resProj.name = project.name;
                    resProj.owner = project.owner;
                    resProj.organization = project.organization;
                    resProj.reddays = project.reddays;
                    resProj.openpositions = project.openpositions;

                    req.project=resProj;
                    next();
                });
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
    res.send(req.project);
};

exports.delete=function(req,res){
    var project = new Projects (req.project);

    // TODO remove from employee
    var oldEmployees = project.employees || [];
    for (var idx = 0; idx < oldEmployees.length; idx ++){
        // remove this employee from project.employees
        Employees.findOne({name:oldEmployees[idx]},function(err,employee){
            if(err){
                next(err);
            }
            if(employee){
                employee.projects.splice(employee.projects.indexOf(project.name),1);

                employee.save(function(err){
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
                    error:"Employee not found"
                };
                //res.status(404).send(error);
            }
        });
    }


    // remove this project from older organization
    if (project.organization) {
      Organizations.findOne({name:project.organization},function(err,org){
          org.projects.splice(org.projects.indexOf(project.name), 1);
          org.save(function(err){ });
      });
    }

    project.remove(function(err){
        if(err){
            console.log(err);
            res.status(400).send(err.err);
        }
        else{
            res.send(project);
        }
    })
};

exports.update=function(req,res){
    var project = new Projects (req.project);

    var newProject = new Projects (req.body);

    // req.body is new data while employee is old data
    var oldEmployees = project.employees || [];
    var newEmployees = req.body.employees || [];
    var idx = 0;
    for (idx = 0; idx < oldEmployees.length; idx ++){
        if (-1 === newEmployees.indexOf(oldEmployees[idx])){
            // remove this employee from project.employees
            Employees.findOne({name:oldEmployees[idx]},function(err,employee){
                if(err){
                    next(err);
                }
                if(employee){
                    employee.projects.splice(employee.projects.indexOf(newProject.name),1);

                    employee.save(function(err){
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
                        error:"Employee not found"
                    };
                    //res.status(404).send(error);
                }
            });
        }
    }
    for (idx = 0; idx < newEmployees.length; idx ++){
        if (-1 === oldEmployees.indexOf(newEmployees[idx])){
            // add this employee to project.employees
            Employees.findOne({name:newEmployees[idx]},function(err,employee){
                if(err){
                    next(err);
                }
                if(employee){
                    employee.projects.push(newProject.name);

                    employee.save(function(err){
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

    // TODO remove this project from older organization
    Organizations.findOne({name:project.organization},function(err,org){
        org.projects.splice(org.projects.indexOf(project.name), 1);
        org.save(function(err){ });
    });
    // TODO add this project to new organization
    Organizations.findOne({name:newProject.organization},function(err,org){
        org.projects.push(project.name);
        org.save(function(err){ });
    });



    for (var i in req.body) {
        project[i] = JSON.parse(JSON.stringify(req.body[i]));
    }
    project.save(function(err){
        if(err){
            console.log(err);
            res.status(400).send(err.err);
        }
        else{
            res.send(project);
        }
    })

};
