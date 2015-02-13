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

exports.projectHistoryById=function(req,res,next,id){
    // Get History
    ProjectHistory.find({projId: id}, {}, {skip:0, limit:10, sort:{'created': 1}},
        function(err, orgHistory){
            var history = {};
            var historyLen = orgHistory ? orgHistory.length: 0;
            history.billable = [];
            history.bench = [];
            history.total = [];
            history.labels = [];
            for (var idx= 0; idx < historyLen; idx++) {
                history.billable.push(orgHistory[idx].billable);
                history.bench.push(orgHistory[idx].bench);
                history.total.push(orgHistory[idx].total);
                history.labels.push(orgHistory[idx].created);
            }

            req.history=history;
            next();
        });
};

exports.read=function(req,res){
    res.send(req.history);
};
