const fs = require("fs");

const deleteFile = async function(filePath) {
  return new Promise(function(res, rej) {
    fs.unlink(filePath, (err, data) => {
      if (err) return rej(err);
      res(data);
    });
  });
};

const writeFile = async function(filePath, data) {
  return new Promise(function(res, rej) {
    fs.writeFile(filePath, data, (err, response) => {
      if (err) return rej(err);
      res(response);
    });
  });
};

module.exports = {
  writeFile,
  deleteFile
};
