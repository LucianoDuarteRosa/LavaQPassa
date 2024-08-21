class Database {
  
  initConnection(connection) {
    this.connection = connection; 
    this.initDatabase(); 
  }

  initDatabase() {
    this.connection.connect((error) => {
      if (error) {
        console.log("Ocorreu um erro ao conectar no banco de dados...");
        console.log(error.message); 
        return;
      }
      console.log("Banco de dados conectado com sucesso..."); 
    });
  }
}

module.exports = new Database();
