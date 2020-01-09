const { copyFile } = require("../helper/file");
const { createDirectory } = require("../helper/directory");
const pathLib = require("path");

const write = async function({ tempFilePath, path, name, database }) {
  await createDirectory(path);

  if (typeof name === "function") {
    name = name(database);
  } else {
    name = Date.now() + "-" + database + "-" + name;
  }

  if (typeof name !== "string") {
    throw "invalid name property";
  }

  const destFilePath = pathLib.join(path, name);
  console.log(
    `Starting copy [file]${tempFilePath} to [file]${destFilePath}`
  );
  const result = await copyFile(tempFilePath, destFilePath);

  console.log(
    `Done with copy [file]${tempFilePath} to [file]${destFilePath}`
  );

  return result;
};

module.exports = {
  write
};
