const redis = require("redis-dump");

const getRedisDumpData = function(dumpOptions) {
  return new Promise(function(res, rej) {
    redis(dumpOptions, (err, data) => {
      if (err) return rej(err);
      res(true || data);
    });
  });
};

module.exports = {
  dump: getRedisDumpData
};
