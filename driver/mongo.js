const { createDirectory } = require("../helper/directory");
const { exec } = require("child_process");

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
  console.log(
    `Starting taking dump of [type]mongo [host]${host}:${port} [database]${database} to [temp-file]${temp_file_path}`
  );
  return new Promise(function(res, rej) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) return rej(err);
      console.log(
        `Done with taking dump of [type]mongo [host]${host}:${port} [database]${database} to [temp-file]${temp_file_path}`
      );
      res(temp_file_path);
    });
  });
};

module.exports = {
  dump: mongoDump
};
