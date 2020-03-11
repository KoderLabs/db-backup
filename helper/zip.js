const { exec } = require("child_process");

const createZip = async function(fileName, filePath, password) {
  return new Promise((res, rej) => {
    exec(`zip -m -j -P ${password} ${fileName} ${filePath}`, (err, data, stderr) => {
      if (err) return rej(err);
      res("done!");
    });
  });
};

module.exports = {
  createZip
};
