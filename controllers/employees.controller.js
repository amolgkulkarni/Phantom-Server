/**
 * Created by sharadau on 2/5/2015.
 */
var mongoose = require('mongoose'),
    Employees = mongoose.model('Employees'),
    Projects = mongoose.model('Projects'),
    Organizations = mongoose.model('Organizations'),
    ProjectHistory = mongoose.model('ProjectHistory'),
    OrganizationHistory = mongoose.model('OrganizationHistory');

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
    var newProjects = req.body.projects || [];

    for (idx = 0; idx < newProjects.length; idx ++){
        // add this employee to project.employees
        Projects.findOne({name:newProjects[idx]},function(err,project){
            if(err){
                next(err);
            }
            if(project){
                project.employees.push(employee.name);
                // update projects
                project.save(function(err){});

                // update projectshistory
                var  projectHistory = new ProjectHistory ({
                    projId: project._id
                });
                ProjectHistory.find({projId: projectHistory.projId}, {}, {skip:0, limit:1, sort:{'created': -1}},
                    function(err, projHistory){
                        if (projHistory.length === 0) {
                            projHistory.push({total: 0, billable: 0, bench: 0});
                        }
                        projectHistory.total = projHistory[0].total + 1;
                        if (employee.billable) {
                            projectHistory.billable = projHistory[0].billable + 1;
                            projectHistory.bench = projHistory[0].bench;
                        }else {
                            projectHistory.billable = projHistory[0].billable;
                            projectHistory.bench = projHistory[0].bench + 1;
                        }
                        projectHistory.save(function(err){});
                    });
            }
            else{
                var error={
                    error:"Project not found"
                };
            }
        });
    }

    // Save Employee
    employee.save(function(err){
        if(err){
            res.status(400).send(err.err);
        }
        else{
            res.send(employee);
        }
    });

    if (!employee.organization) {
        // No need to update organization history
        return;
    }
    Organizations.findOne({name: employee.organization}, function(err, organization){
        var  organizationHistory = new OrganizationHistory ({
            orgId: organization._id
        });
        OrganizationHistory.find({orgId: organizationHistory.orgId}, {}, {skip:0, limit:1, sort:{'created': -1}},
            function(err, orgHistory){
                if (orgHistory.length === 0) {
                    orgHistory.push({total: 0, billable: 0, bench: 0});
                }
                organizationHistory.total = organization.total = orgHistory[0].total + 1;
                if (employee.billable) {
                    organizationHistory.billable = organization.billable = orgHistory[0].billable + 1;
                    organizationHistory.bench = orgHistory[0].bench;
                }else {
                    organizationHistory.billable = organization.billable = orgHistory[0].billable;
                    organizationHistory.bench = orgHistory[0].bench + 1;
                }
                organizationHistory.save(function(err){});
                organization.save(function(err){});
        });
    });
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

    var oldProjects = employee.projects || [];
    for (var idx = 0; idx < oldProjects.length; idx ++){
        // remove this employee from project.employees
        Projects.findOne({name:oldProjects[idx]},function(err,project){
            if(err){
                next(err);
            }
            if(project){
                project.employees.splice(project.employees.indexOf(employee.name),1);
                project.save(function(err){});

                // Update ProjectHistory
                var  projectHistory = new ProjectHistory ({
                    projId: project._id
                });
                ProjectHistory.find({projId: projectHistory.projId}, {}, {skip:0, limit:1, sort:{'created': -1}},
                    function(err, projHistory){
                        if (projHistory.length === 0) {
                            projHistory.push({total: 0, billable: 0, bench: 0});
                        }
                        projectHistory.total = projHistory[0].total - 1;
                        if (employee.billable) {
                            projectHistory.billable = projHistory[0].billable - 1;
                            projectHistory.bench = projHistory[0].bench;
                        }else {
                            projectHistory.billable = projHistory[0].billable;
                            projectHistory.bench = projHistory[0].bench - 1;
                        }
                        projectHistory.save(function(err){});
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


    if (!employee.organization) {
        // No need to update organization history
        return;
    }
    // Update OrganizationHistory
    Organizations.findOne({name: employee.organization}, function(err, organization){
        var  organizationHistory = new OrganizationHistory ({
            orgId: organization._id
        });
        OrganizationHistory.find({orgId: organizationHistory.orgId}, {}, {skip:0, limit:1, sort:{'created': -1}},
            function(err, orgHistory){
                if (orgHistory.length === 0) {
                    orgHistory.push({total: 0, billable: 0, bench: 0});
                }
                organizationHistory.total = organization.total = orgHistory[0].total - 1;
                if (employee.billable) {
                    organizationHistory.billable = organization.billable = orgHistory[0].billable - 1;
                    organizationHistory.bench = orgHistory[0].bench;
                }else {
                    organizationHistory.billable = organization.billable = orgHistory[0].billable;
                    organizationHistory.bench = orgHistory[0].bench - 1;
                }
                organizationHistory.save(function(err){});
                organization.save(function(err){});
            });
    });
};

exports.update=function(req,res){
    var employee = req.employee;
    var oldEmpOrg = employee.organnization;
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
                        project.save(function(err){});

                        // Update ProjectHistory
                        var  projectHistory = new ProjectHistory ({
                            projId: project._id
                        });
                        ProjectHistory.find({projId: projectHistory.projId}, {}, {skip:0, limit:1, sort:{'created': -1}},
                            function(err, projHistory){
                                projectHistory.total = projHistory[0].total - 1;
                                if (employee.billable) {
                                    projectHistory.billable = projHistory[0].billable - 1;
                                    projectHistory.bench = projHistory[0].bench;
                                }else {
                                    projectHistory.billable = projHistory[0].billable;
                                    projectHistory.bench = projHistory[0].bench - 1;
                                }
                                projectHistory.save(function(err){});
                            });
                    }
                    else{
                        var error={
                            error:"Project not found"
                        };
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
                    project.save(function(err){});

                    // update projectshistory
                    var  projectHistory = new ProjectHistory ({
                        projId: project._id
                    });
                    ProjectHistory.find({projId: projectHistory.projId}, {}, {skip:0, limit:1, sort:{'created': -1}},
                        function(err, projHistory){
                            if (projHistory.length === 0) {
                                projHistory.push({total: 0, billable: 0, bench: 0});
                            }
                            projectHistory.total = projHistory[0].total + 1;
                            if (employee.billable) {
                                projectHistory.billable = projHistory[0].billable + 1;
                                projectHistory.bench = projHistory[0].bench;
                            }else {
                                projectHistory.billable = projHistory[0].billable;
                                projectHistory.bench = projHistory[0].bench + 1;
                            }
                            projectHistory.save(function(err){});
                        });
                }
                else{
                    var error={
                        error:"Project not found"
                    };
                }
            });
        } else if (employee.billable !== newEmployee.billable) {
            // Projects are not updated but billability status has changed
            Projects.findOne({name:newProjects[idx]},function(err,project){
                if(err){
                    next(err);
                }
                if(project){
                    // update projecthistory
                    var  projectHistory = new ProjectHistory ({
                        projId: project._id
                    });

                    ProjectHistory.find({projId: projectHistory.projId}, {}, {skip:0, limit:1, sort:{'created': -1}},
                        function(err, projHistory){
                            if (projHistory.length === 0) {
                                projHistory.push({total: 0, billable: 0, bench: 0});
                            }
                            projectHistory.total = projHistory[0].total;
                            if (employee.billable) {
                                projectHistory.billable = projHistory[0].billable + 1;
                                projectHistory.bench = projHistory[0].bench - 1;
                            }else {
                                projectHistory.billable = projHistory[0].billable - 1;
                                projectHistory.bench = projHistory[0].bench + 1;
                            }
                            projectHistory.save(function(err){});
                        });
                }
                else{
                    var error={
                        error:"Project not found"
                    };
                }
            });
        }
    }

    // Update organization History
    if (employee.organization !== newEmployee.organization) {
        Organizations.findOne({name: employee.organization}, function(err, oldorganization){
            Organizations.findOne({name: newEmployee.organization}, function(err, neworganization){

                if (oldorganization) {
                    // No need to update if old org was not set
                    var  oldOrganizationHistory = new OrganizationHistory ({
                        orgId: oldorganization._id
                    });

                    OrganizationHistory.find({orgId: oldOrganizationHistory.orgId}, {}, {skip:0, limit:1, sort:{'created': -1}},
                    function(err, orgHistory){
                        if (orgHistory.length === 0) {
                            orgHistory.push({total: 0, billable: 0, bench: 0});
                        }
                        oldOrganizationHistory.total =  oldorganization.total = orgHistory[0].total - 1;
                        if (employee.billable) {
                            oldOrganizationHistory.billable = oldorganization.billable = orgHistory[0].billable - 1;
                            oldOrganizationHistory.bench = orgHistory[0].bench;
                        } else {
                            oldOrganizationHistory.billable = oldorganization.billable = orgHistory[0].billable;
                            oldOrganizationHistory.bench = orgHistory[0].bench - 1;
                        }
                        oldOrganizationHistory.save(function(err){console.log(err);});
                        oldorganization.save(function(err){console.log(err);});
                    });
                }

                if (neworganization) {
                    // No need to set if org is not set
                    var  newOrganizationHistory = new OrganizationHistory ({
                        orgId: neworganization._id
                    });

                    OrganizationHistory.find({orgId: newOrganizationHistory.orgId}, {}, {skip:0, limit:1, sort:{'created': -1}},
                    function(err, orgHistory1){
                        if (orgHistory1.length === 0) {
                            orgHistory1.push({total: 0, billable: 0, bench: 0});
                        }
                        newOrganizationHistory.total =  neworganization.total = orgHistory1[0].total + 1;
                        if (newEmployee.billable) {
                            newOrganizationHistory.billable = neworganization.billable = orgHistory1[0].billable + 1;
                            newOrganizationHistory.bench = orgHistory1[0].bench;
                        } else {
                            newOrganizationHistory.billable = neworganization.billable = orgHistory1[0].billable;
                            newOrganizationHistory.bench = orgHistory1[0].bench + 1;
                        }
                        newOrganizationHistory.save(function(err){console.log(err);});
                        neworganization.save(function(err){console.log(err);});
                    });
                }
            });

        });

    } else if (employee.billable !== newEmployee.billable) {
        Organizations.findOne({name: employee.organization}, function(err, organization){
            var  organizationHistory = new OrganizationHistory ({
                orgId: organization._id
            });
            OrganizationHistory.find({orgId: organizationHistory.orgId}, {}, {skip:0, limit:1, sort:{'created': -1}},
                function(err, orgHistory){
                    if (orgHistory.length === 0) {
                        orgHistory.push({total: 0, billable: 0, bench: 0});
                    }
                    organizationHistory.total = organization.total = orgHistory[0].total;
                    if (newEmployee.billable) {
                        organizationHistory.billable = organization.billable = orgHistory[0].billable + 1;
                        organizationHistory.bench = orgHistory[0].bench - 1;
                    }else {
                        organizationHistory.billable = organization.billable = orgHistory[0].billable - 1;
                        organizationHistory.bench = orgHistory[0].bench + 1;
                    }
                    organizationHistory.save(function(err){});
                    organization.save(function(err){});
                });
        });
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