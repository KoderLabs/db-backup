const { exec } = require("child_process");
const { createDirectory } = require("../helper/directory");

const dump = async function({ host, port, username, password, database, temp_dir, temp_file_path }) {
  await createDirectory(temp_dir);

  console.log(`Starting taking dump of [type]mysql [host]${host}:${port} [database]${database} to [temp-file]${temp_file_path}`);
  const cmd = `mysqldump -h${host} -P${port} --user=${username} --password=${password} --databases ${database} > ${temp_file_path}`;
  return new Promise((res, rej) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) return rej(err);
      console.log(`Done with taking dump of [type]mysql [host]${host}:${port} [database]${database} to [temp-file]${temp_file_path}`);
      res(temp_file_path);
    });
  });
};

module.exports = {
  dump
};
