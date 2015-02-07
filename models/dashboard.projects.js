/**
 * Created by sharadau on 2/5/2015.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectsSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    start_date:{
        type:Date,
        required:false
    },
    end_date:{
        type:Date,
        required:false
    },
    _id:{
        type:Number,
        required:true
    },
    organization:{
        type:String,
        required:false
    },
    owner:{
        type:String,
        required:false
    },
    openpositions:{
        type:Number,
        required:false,
        default: 0
    },
    reddays:{
        type:Number,
        required:false,
        default: 0
    },
    employees:{
        type:[String],
        required:false
    }
});
mongoose.model('Projects',ProjectsSchema);