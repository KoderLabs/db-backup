const fs = require("fs");
const {exec} = require("child_process");


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

const copyFile = async function(source, destination) {
  return new Promise(function(res, rej) {
    exec(`cp ${source} ${destination}`, (err, stdout, stderr) => {
      if (err) return rej(err);
      res(true);
    });
  });
};

module.exports = {
  writeFile,
  deleteFile,
  copyFile
};
