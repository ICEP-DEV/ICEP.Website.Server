require('dotenv').config();
var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'ls-23121a88d4cbb089991485b0bec9f393441a0883.cx2su6ewedog.eu-west-2.rds.amazonaws.com',
    user: 'dbmasteruser',
    password: 'ZHD5ToK:|.]OByYU%F5ys3tl-,7#H2XA',
    database: 'icep_db'
});

connection.connect((err) => {
    if (!err)
        console.log('Connection Established Successfully');
    else
        console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});

module.exports = connection;