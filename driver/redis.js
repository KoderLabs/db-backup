const redis = require("redis-dump");
const { writeFile } = require("../helper/file");

const getRedisDumpData = function(dumpOptions) {
  return new Promise(function(res, rej) {
    redis(dumpOptions, (err, data) => {
      if (err) return rej(err);
      writeFile(dumpOptions.temp_file_path, data).then(data => {
        res(dumpOptions.temp_file_path);
      });
    });
  });
};

module.exports = {
  dump: getRedisDumpData
};
