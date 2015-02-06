/**
 * Created by sharadau on 2/5/2015.
 */
var mongoose = require('mongoose'),
    Projects = mongoose.model('Projects');

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
            req.project=project;
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
    res.send(req.project);
};

exports.delete=function(req,res){
    var project = req.project;
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
    var project = req.project;
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