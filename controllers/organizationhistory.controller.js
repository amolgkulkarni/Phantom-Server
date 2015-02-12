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
