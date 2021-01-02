const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'myPassword123',
    database: 'company_db'
});

connection.connect(function(err){
    if(err) throw err;
    console.log(`connected to id ${connection.threadId}`);
    testConnection();
});

function testConnection(){
    connection.query("SELECT * FROM department", function(err, res){
        if(err) throw err;
        console.log(res);
        connection.end();
    });
};