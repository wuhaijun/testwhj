const mongoose = require('mongoose');
const DB = require('./DB');


const StyleTypeSchema = new mongoose.Schema({
    name: String,
    children: Array
});

module.exports = DB.get('editor').model('StyleType', StyleTypeSchema);


