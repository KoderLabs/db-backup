const aws = require("aws-sdk");
const pathLib = require("path");
const fs = require("fs");

const write = async function({
  tempFilePath,
  path,
  name,
  database,
  secretAccessKey,
  accessKeyId,
  bucket,
  acl
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
  const stream = fs.createReadStream(tempFilePath);
  const key = pathLib.join(path, name);

  return new Promise(function(res, rej) {
    console.log(
      `Starting upload of [file]${tempFilePath} to [Bucket]${bucket} with [key]${key}`
    );
    s3.upload(
      {
        Bucket: bucket,
        Key: key,
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
};

module.exports = {
  write
};
