
const mysql = require("mysql");


const sqlConnection = mysql.createConnection({
  host: "localhost",       
  port: 3306,              
  user: "admin",           
  password: "admin",       
  database: "lavaqpassabrecho",    
});


module.exports = sqlConnection;