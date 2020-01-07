const mkdirp = require("mkdirp");
const createDirectory = async function(path) {
  return new Promise((res, rej) => {
    mkdirp(path, (err, data) => {
      if (err) return rej(err);
      res(data);
    });
  });
};

module.exports = {
    createDirectory
};
