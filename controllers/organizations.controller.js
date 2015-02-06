var mongoose = require('mongoose'),
    Organizations = mongoose.model('Organizations');

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
