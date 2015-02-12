var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrganizationHistorySchema = new Schema({
    orgId:{
        type:Number,
        required:true
    },
    total:{
        type:Number,
        required:false
    },
    billable:{
        type:Number,
        required:false
    },
    bench:{
        type:Number,
        required:false
    },
    created: {
        type: Date,
        default:Date.now
    }
});
mongoose.model('OrganizationHistory',OrganizationHistorySchema);