const aws = require("aws-sdk");
const pathLib = require("path");
const fs = require("fs");

const { copyFile } = require("../helper/file");
const { createZip } = require("../helper/zip");

const write = async function({
  tempFilePath,
  path,
  name,
  database,
  secretAccessKey,
  accessKeyId,
  bucket,
  acl,
  password = ""
}) {
  const s3Config = {};

  accessKeyId && (s3Config.accessKeyId = accessKeyId);
  secretAccessKey && (s3Config.secretAccessKey = secretAccessKey);

  if (typeof name === "function") {
    name = name(database);
  } else {
    name = Date.now() + "-" + database + "-" + name;
  }

  if (typeof name !== "string") {
    throw "invalid name property";
  }
  const s3 = new aws.S3(s3Config);
  const uploadOptions = { partSize: 50 * 1024 * 1024 * 1024, queueSize: 10 };
  const key = pathLib.join(path, name);

  return new Promise(function(res, rej) {
    console.log(`Starting copy [file]${tempFilePath} to [file]${key}`);
    copyFile(tempFilePath, key).then(result => {
      console.log(`Done with copy [file]${tempFilePath} to [file]${key}`);
      const zipKey = key + ".zip";
      console.log(`Starting zip [file]${tempFilePath} to [file]${key}`);
      createZip(zipKey, key, password).then(zip => {
        console.log(`Done with zip [file]${tempFilePath} to [file]${zipKey}`);
        const stream = fs.createReadStream(zipKey);
        console.log(
          `Starting upload of [file]${tempFilePath} to [Bucket]${bucket} with [key]${zipKey}`
        );
        s3.upload(
          {
            Bucket: bucket,
            Key: zipKey,
            ACL: acl || "private",
            Body: stream
          },
          uploadOptions,
          function(err, data) {
            if (err) return rej(err);
            console.log(
              `Done with upload of [file]${tempFilePath} to [Bucket]${bucket} with [key]${key}`
            );
            res(data);
          }
        );
      });
    });
  });
};

module.exports = {
  write
};
