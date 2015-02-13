var mongoose = require('mongoose'),
    OrganizationHistory = mongoose.model('OrganizationHistory');

exports.list=function(req,res,next){

    OrganizationHistory.find(function(err, organizationhistory){
        if(err){
            next(err);
        }
        res.send(organizationhistory);
    })
};

exports.create=function(req,res){
    var organizationhistory = new OrganizationHistory (req.body);

    organizationhistory.save(function(err){
        if(err){
            res.status(400).send(err.err);
        }
        else{
            res.send(organizationhistory);
        }
    })
};

exports.organizationHistoryById=function(req,res,next,id){
    // Get History
    OrganizationHistory.find({orgId: id}, {}, {skip:0, limit:10, sort:{'created': 1}},
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
