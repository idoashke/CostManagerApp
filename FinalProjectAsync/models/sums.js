const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SumSchema = new Schema({
    userId : {type: Number},
    year : {type : String},
    '00' : {type : Number, default : 0},
    '01' : {type : Number, default : 0},
    '02' : {type : Number, default : 0},
    '03' : {type : Number, default : 0},
    '04' : {type : Number, default : 0},
    '05' : {type : Number, default : 0},
    '06' : {type : Number, default : 0},
    '07' : {type : Number, default : 0},
    '08' : {type : Number, default : 0},
    '09' : {type : Number, default : 0},
    '10' : {type : Number, default : 0},
    '11' : {type : Number, default : 0},
    '12' : {type : Number, default : 0},
    totalSum : {type : Number, default : 0}

});

const Sum = mongoose.model('sums', SumSchema);

module.exports = Sum;

