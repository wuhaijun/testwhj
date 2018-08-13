const mongoose = require('mongoose');
const DB = require('./DB');

const CompanySchema = new mongoose.Schema({
    _id: String,
    name: String,
    brands: Array
});

module.exports = DB.get('schedule').model('Company', CompanySchema);