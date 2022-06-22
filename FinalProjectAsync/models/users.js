const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id : {type: Number},
    fName : {type: String},
    lName : {type: String},
    gender : {type: String},
    mStatus : {type: String},
    bDate : {type: Date}
});

const User = mongoose.model('users', UserSchema);

module.exports = User;

