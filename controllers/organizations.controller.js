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
            req.organization=organization;
            next();
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
        // remove this organization from project.organization
        Projects.findOne({name:oldProjects[idx]},function(err,project){
            if(err){
                next(err);
            }
            if(project){

                // add this project to parent organization
                Organizations.findOne({name:organization.parent},function(err,org){
                    if (org) {
                        org.projects.push(project.name);
                        org.save(function(err){ });
                    }
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
    var organization = req.organization;

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
