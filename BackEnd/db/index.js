const dbConnection = require("./dbConnection");

const db = require("./dbCreate");

module.exports = () => {
  db.initConnection(dbConnection);
};
