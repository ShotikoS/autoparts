const addNewRecord = require("./methods/addNewRecord");
const deleteRecord = require("./methods/deleteRecord");
const editRecord = require('./methods/editRecord');
const getRecords = require("./methods/getRecords");
const auth = require('./methods/auth');
const changePass = require('./methods/changePass');
const select = require('./methods/select');

const api = {
    addNewRecord,
    deleteRecord,
    editRecord,
    getRecords,
    auth,
    changePass,
    select
}

module.exports = api;