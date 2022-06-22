const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CostsSchema = new Schema({
    userId : {type: Number},
    date : {type: Date},
    title : {type: String},
    sum : {type: Number},
    category : {type: String},
    description : {type: String}
});

const Cost = mongoose.model('costs', CostsSchema);

module.exports = Cost;

