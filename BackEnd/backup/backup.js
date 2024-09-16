const { exec } = require('child_process');
const path = require('path');

class Backup {

  backupDatabase() {
    const backupFilePath = path.join(__dirname, 'backups', `backup-${Date.now()}.sql`);
    const password = '123';
    const dumpCommand = `mysqldump -u root -p${password} lavaQPassaBrecho > ${backupFilePath}`;

    exec(dumpCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating backup: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Backup stderr: ${stderr}`);
        return;
      }
      console.log('Backup created successfully:', backupFilePath);
    });
  }
}

module.exports = new Backup();
