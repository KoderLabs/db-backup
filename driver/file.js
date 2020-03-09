const { copyFile } = require("../helper/file");
const { createDirectory } = require("../helper/directory");
const { createZip } = require("../helper/zip");
const pathLib = require("path");

const write = async function({ tempFilePath, path, name, database, password = "" }) {
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
  const zipDestFilePath = destFilePath + ".zip";

  console.log(`Starting copy [file]${tempFilePath} to [file]${destFilePath}`);
  let result = await copyFile(tempFilePath, destFilePath);
  console.log(`Done with copy [file]${tempFilePath} to [file]${destFilePath}`);

  console.log(`Starting zip [file]${tempFilePath} to [file]${zipDestFilePath}`);
  result = await createZip(zipDestFilePath, destFilePath, password);
  console.log(`Done with zip [file]${tempFilePath} to [file]${zipDestFilePath}`);

  return result;
};

module.exports = {
  write
};
