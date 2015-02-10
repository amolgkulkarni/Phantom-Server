var mongoose = require('mongoose'),
    Organizations = mongoose.model('Organizations'),
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
    var organizations = new Organizations (req.body);

    var newProjects = req.body.projects || [];

    for (idx = 0; idx < newProjects.length; idx ++){
        // add this org to project.organization
        Projects.findOne({name:newProjects[idx]},function(err,project){
            if(err){
                next(err);
            }
            if(project){
                // TODO remove this from older organization.
                Organizations.findOne({name:project.organization},function(err,org){
                  org.projects.splice(org.projects.indexOf(project.name), 1);
                  org.save(function(err){ });
                });

                project.organization = organizations.name;

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

    organizations.save(function(err){
        if(err){
            res.status(400).send(err.err);
        }
        else{
            res.send(organizations);
        }
    })
};

exports.organizationById=function(req,res,next,id){
    Organizations.findOne({_id:id},function(err,organization){
        if(err){
            next(err);
        }
        if(organization){
            req.organization=organization;
            next();
            ///res.send(organization);
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
    var organization = req.organization;


    var oldProjects = organization.projects || [];
    for (var idx = 0; idx < oldProjects.length; idx ++){
        // remove this employee from project.employees
        Projects.findOne({name:oldProjects[idx]},function(err,project){
            if(err){
                next(err);
            }
            if(project){

                // TODO add this project to new organization 'Synerzip
                Organizations.findOne({name:'Synerzip'},function(err,org){
                    org.projects.push(project.name);
                    org.save(function(err){ });
                });

                project. organization = 'Synerzip'; // TODO dont allow synerzip to renamed or deleted;

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
    })
};

exports.update=function(req,res){
    var organization = req.organization;


    var newOrganization = req.body;

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

                    // TODO add this project to new organization 'Synerzip
                    Organizations.findOne({name:'Synerzip'},function(err,org){
                        org.projects.push(project.name);
                        org.save(function(err){ });
                    });

                    project.organization = 'Synerzip';

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
            // add this org to project.organization
            Projects.findOne({name:newProjects[idx]},function(err,project){
                if(err){
                    next(err);
                }
                if(project){
                    // TODO remove this project from older organization
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
