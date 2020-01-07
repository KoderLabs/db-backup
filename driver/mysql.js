const { exec } = require("child_process");
const { createDirectory } = require("../helper/directory");

const dump = async function({
  host,
  port,
  username,
  password,
  database,
  temp_dir,
  temp_file_path
}) {
  await createDirectory(temp_dir);
  const cmd = `mysqldump -h${host} -P${port} --user=${username} --password=${password} --databases ${database} > ${temp_file_path}`;
  return new Promise((res, rej) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) return rej(err);
      res(true);
    });
  });
};

module.exports = {
  dump
};
