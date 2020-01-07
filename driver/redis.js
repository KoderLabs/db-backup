const redis = require("redis-dump");
const getRedisDumpData = dumpOptions => {
  return new Promise((res, rej) => {
    redis(dumpOptions, (err, data) => {
      if (err) {
        rej(err);
      } else {
        res(data);
      }
    });
  });
};

module.exports = {
  dump: getRedisDumpData
};
