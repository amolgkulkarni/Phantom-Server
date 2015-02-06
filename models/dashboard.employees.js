/**
 * Created by sharadau on 2/5/2015.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EmployeesSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    org_id:{
        type:Number,
        required:true
    },
    prj_id:{
        type:[String],
        required:true
    },
    _id:{
        type:Number,
        required:true
    }
});
mongoose.model('Employees',EmployeesSchema);