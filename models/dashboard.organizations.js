
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrganizationsSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    owner:{
        type:[String],
        required:false
    },
    _id:{
        type:Number,
        required:true
    },
    total:{
        type: Number,
        required: false
    },
    billable:{
        type: Number,
        required: false
    },
    projects:{
        type:[String],
        required:false
    }
});
mongoose.model('Organizations',OrganizationsSchema);