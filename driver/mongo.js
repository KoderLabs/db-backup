const { createDirectory } = require("../helper/directory");
const {exec} = require("child_process");

const mongoDump = async function({
  host,
  port,
  username,
  password,
  database,
  temp_dir,
  temp_file_path
}) {
  await createDirectory(temp_dir);
  const cmd = `mongodump --host=${host} --port=${port} --username=${username} --password=${password} -d ${database} --gzip --archive=${temp_file_path}`;

  return new Promise(function(res, rej) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) return rej(err);
      res(true);
    });
  });
};

module.exports = {
  dump: mongoDump
};
