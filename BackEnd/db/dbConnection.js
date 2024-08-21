
const mysql = require("mysql");


const sqlConnection = mysql.createConnection({
  host: "localhost",       
  port: 3306,              
  user: "root",           
  password: "123",       
  database: "lavaqpassabrecho",    
});


module.exports = sqlConnection;