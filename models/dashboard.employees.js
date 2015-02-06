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
    organization:{
        type:String,
        required:false
    },
    projects:{
        type:[String],
        required:false
    },
    _id:{
        type:Number,
        required:true
    },
    billable: {
        type: Boolean,
        required:false,
        default: false
    }
});
mongoose.model('Employees',EmployeesSchema);