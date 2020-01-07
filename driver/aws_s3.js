const aws = require("aws-sdk");

const initS3 = (key, secret) => {
  return new aws.S3({
    accessKeyId: key,
    secretAccessKey: secret
  });
};

const makeBucketUploadObject = (bucket, filename, acl = "public read") => {
  return {
    Bucket: bucket,
    Key: filename,
    ACL: acl
  };
};

const uploadToS3 = (fileName, bucket, uploadOptions) => {
  const stream = fs.createReadStream(fileName);
  uploadOptions.Body = stream;
  return new Promise((res, rej) => {
    bucket.upload(uploadOptions, (err, data) => {
      if (err) {
        return rej(err);
      } else {
        return res(data);
      }
    });
  });
};
