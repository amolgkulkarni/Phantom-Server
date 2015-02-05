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
        required:true
    },
    end_date:{
        type:Date,
        required:true
    },
    _id:{
        type:Number,
        required:true
    },
    org_id:{
        type:Number,
        required:false
    },
    owner:{
        type:String,
        required:false
    },
    openpositions:{
        type:Number,
        required:false
    },
    reddays:{
        type:Number,
        required:false
    },
    people:{
        type:[String],
        required:true
    }
});
mongoose.model('Projects',ProjectsSchema);