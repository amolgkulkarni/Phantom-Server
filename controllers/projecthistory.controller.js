var mongoose = require('mongoose'),
    ProjectHistory = mongoose.model('ProjectHistory');

exports.list=function(req,res,next){

    ProjectHistory.find(function(err, projecthistory){
        if(err){
            next(err);
        }
        res.send(projecthistory);
    })
};

exports.create=function(req,res){
    var projecthistory = new ProjectHistory (req.body);

    projecthistory.save(function(err){
        if(err){
            res.status(400).send(err.err);
        }
        else{
            res.send(projecthistory);
        }
    })
};
