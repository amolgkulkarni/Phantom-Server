
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrganizationsSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    owner:{
        type:String,
        required:true
    },
    _id:{
        type:Number,
        required:true
    },
    billable:{
        type:[Number],
        required:false
    },
    bench:{
        type:[Number],
        required:false
    },
    projects:{
        type:[String],
        required:false
    },
    chart:{
        type:String,
        required:false
    }
});
mongoose.model('Organizations',OrganizationsSchema);