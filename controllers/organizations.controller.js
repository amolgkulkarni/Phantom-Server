var mongoose = require('mongoose'),
    Organizations = mongoose.model('Organizations'),
    OrganizationHistory = mongoose.model('OrganizationHistory'),
    Projects = mongoose.model('Projects');

exports.list=function(req,res,next){
    Organizations.find(function(err, organizations){
        if(err){
            next(err);
        }
        res.send(organizations);
    })
};

exports.create=function(req,res){
    var organization = new Organizations (req.body);

    var newProjects = req.body.projects || [];

    for (idx = 0; idx < newProjects.length; idx ++){
        // add this org to project.organization
        Projects.findOne({name:newProjects[idx]},function(err,project){
            if(err){
                next(err);
            }
            if(project){
                // remove this project from older organization.
                if (project.organization) {
                  Organizations.findOne({name:project.organization},function(err,org){
                    org.projects.splice(org.projects.indexOf(project.name), 1);
                    org.save(function(err){ });
                  });
                }

                project.organization = organization.name;

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

    organization.save(function(err){
        if(err){
            res.status(400).send(err.err);
        }
        else{
            res.send(organization);
        }
    })
};

exports.organizationById=function(req,res,next,id){
    Organizations.findOne({_id:id},function(err,organization){
        if(err){
            next(err);
        }
        if(organization){
            // Get History
            OrganizationHistory.find({orgId: organization._id}, {}, {skip:0, limit:10, sort:{'created': 1}},
                function(err, orgHistory){
                    var resOrg = {};
                    var historyLen = orgHistory ? orgHistory.length: 0;
                    resOrg.billable = [];
                    resOrg.bench = [];
                    resOrg.total = [];
                    resOrg.labels = [];
                    for (var idx= 0; idx < historyLen; idx++) {
                        resOrg.billable.push(orgHistory[idx].billable);
                        resOrg.bench.push(orgHistory[idx].bench);
                        resOrg.total.push(orgHistory[idx].total);
                        resOrg.labels.push(orgHistory[idx].created);
                    }

                    resOrg.projects = organization.projects;
                    resOrg._id = organization._id;
                    resOrg.name = organization.name;
                    resOrg.owner = organization.owner;

                    req.organization=resOrg;
                    next();
                });
        }
        else{
            var error= { error:"Todo not found"};
            res.status(404).send(error);
        }
    });
};

exports.read=function(req,res){
    res.send(req.organization);
};
exports.delete=function(req,res){
    var organization = new Organizations(req.organization);

    var oldProjects = organization.projects || [];
    for (var idx = 0; idx < oldProjects.length; idx ++){
        // remove this project from project.employees
        Projects.findOne({name:oldProjects[idx]},function(err,project){
            if(err){
                next(err);
            }
            if(project){

                // add this project to parent organization
                Organizations.findOne({name:organization.parent},function(err,org){
                    org.projects.push(project.name);
                    org.save(function(err){ });
                });

                project.organization = organization.parent;

                project.save(function(err){});
            }
            else{
                var error={
                    error:"Employee not found"
                };
                //res.status(404).send(error);
            }
        });
    }

    organization.remove(function(err){
        if(err){
            console.log(err);
            res.status(400).send(err.err);
        }
        else{
            res.send(organization);
        }
    });
};

exports.update=function(req,res){
    var organization = new Organizations(req.organization);


    var newOrganization = new Organizations(req.body);

    // req.body is new data while organization is old data
    var oldProjects = organization.projects || [];
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

                    // add this project to new organization 'Synerzip
                    Organizations.findOne({name:newOrganization.parent},function(err,org){
                        org.projects.push(project.name);
                        org.save(function(err){ });
                    });

                    project.organization = newOrganization.parent;

                    project.save(function(err){});
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
            // add this org to project.organization
            Projects.findOne({name:newProjects[idx]},function(err,project){
                if(err){
                    next(err);
                }
                if(project){
                    // remove this project from older organization
                    Organizations.findOne({name:project.organization},function(err,org){
                        org.projects.splice(org.projects.indexOf(project.name), 1);
                        org.save(function(err){ });
                    });

                    project.organization = newOrganization.name;

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
        organization[i] = JSON.parse(JSON.stringify(req.body[i]));
    }
    organization.save(function(err){
        if(err){
            console.log(err);
            res.status(400).send(err.err);
        }
        else{
            res.send(organization);
        }
    })

};
