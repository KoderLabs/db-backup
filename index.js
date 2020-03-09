const fs = require("fs");
const {exec} = require("child_process");
const {schedule, validate} = require("node-cron");
const redis = require("redis-dump");
const aws = require("aws-sdk");
const mkdirp = require("mkdirp");
const config = require("./config");

const initS3 = (key, secret) => {
  return new aws.S3({
    accessKeyId: key,
    secretAccessKey: secret
  });
}

const makeBucketUploadObject = (bucket, filename, acl = "public read") => {
  return {
    Bucket: bucket,
    Key: filename,
    ACL: acl
  }
}

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

const deleteTempFile = (fileName) => {
  return new Promise((res, rej) => {
    fs.unlink(fileName, (err, data) => {
      if (err) {
        rej(err);
      } else {
        res(data);
      }
    });
  });
};

const writeToFile = (fileName, data) => {
  return new Promise((res, rej) => {
    fs.writeFile(fileName, data, (err, response) => {
      if (err) {
        rej(err);
      } else {
        res(response);
      }
    });
  })
}

const createPathIfNotExist = (path) => {
  return new Promise((res, rej) => {
    mkdirp(path, (err, data) => {
      if (err) {
        rej(err);
      } else {
        res(data);
      }
    });
  })
}

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
}

const mongoDump = ({host, port, username, password, database, filePath, fileName}) => {
  return new Promise((res, rej) => {
    createPathIfNotExist(filePath)
    .then(ok => {
      const cmd = `mongodump --host=${host} --port=${port} --username=${username} --password=${password} -d ${database} --gzip --archive=${filePath+fileName}`;
      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          rej(err);
        } else {
          res(true);
        }
      })
    })
    .catch(err => rej(err));
  })
}

const mysqlDump = ({host, port, username, password, databases, filePath, fileName}) => {
  return new Promise((res, rej) => {
    createPathIfNotExist(filePath)
    .then(ok => {
      const cmd = `mysqldump -h${host} -P${port} --user=${username} --password=${password} --databases ${databases.join(" ")} > ${filePath+fileName}`
      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          rej(err);
        } else {
          res(true);
        }
      })
    })
  });
}

async function main() {

  for(var conf of config.config) {
    if (conf.source.type === "mysql") {
      for (let d of conf.destination) {
        const fileName = (d.appendTimestampToFileName ? Date.now()+"-" : "") +d.name;
        let mysqlOptions = {
          host: conf.source.host, 
          port: conf.source.port, 
          username: conf.source.username, 
          password: conf.source.password, 
          databases: conf.source.databases, 
          filePath: d.path, 
          fileName: fileName
        }
        if (d.type === "file") {
          await mysqlDump(mysqlOptions);
        } else if (d.type === "aws") {
          mysqlOptions.filePath = "./";
          mysqlOptions.fileName = "temp.sql";
          await mysqlDump(mysqlOptions);
          let bucket = initS3(d.key, d.secret);
          let uploadOptions = makeBucketUploadObject(d.bucket, fileName, d.acl);
          const {Location, ETag} = await uploadToS3(mysqlOptions.fileName, bucket, uploadOptions);
          await deleteTempFile(mysqlOptions.fileName);
          console.log(`S3 mysql upload done. File URL: ${Location} , ETag: ${ETag}`);
        }
      }
    } else if (conf.source.type === "redis") {
      let dumpOptions = {
        host: conf.source.host,
        port: conf.source.port
      }
      let bucket;
      let uploadOptions;
      for (let d of conf.destination) {
        let writeData = "";
        let tempWriteData = "";
        const fileName = d.path+(d.appendTimestampToFileName ? Date.now()+"-" : "")+d.name;
        for (let db of conf.source.databases) {
          dumpOptions.db = db;
          if (d.type === "file") {
            await createPathIfNotExist(d.path);
            const result = await getRedisDumpData(dumpOptions);
            writeData += (result+"\n");
          } else if (d.type === "aws") {
            const result = await getRedisDumpData(dumpOptions);
            tempWriteData += (result+"\n");
            bucket = initS3(d.key, d.secret);
            uploadOptions = makeBucketUploadObject(d.bucket, fileName, d.acl);
          }
        }
        if (writeData) {
          await writeToFile(fileName, writeData);
        }
        if (tempWriteData && bucket && uploadOptions) {
          await writeToFile("redistemp.rdb", tempWriteData);
          const {Location, ETag} = await uploadToS3("redistemp.rdb", bucket, uploadOptions);
          await deleteTempFile("redistemp.rdb");
          console.log(`S3 Redis backup uploaded. File URL: ${Location}, ETag: ${ETag}`);
        }
      }
    } else if (conf.source.type === "mongo" || conf.source.type === "mongodb") {
      let bucket;
      let uploadOptions;
      for (let d of conf.destination) {
        const fileName = d.path+(d.appendTimestampToFileName ? Date.now()+"-" : "")+d.name;
        for (let db of conf.source.databases) {
          if (d.type === "file") {
            await mongoDump({host: conf.source.host, port: conf.source.port, username: conf.source.username, password: conf.source.password, database: db, filePath: d.path, fileName: d.name});
          } else if (d.type === "aws") {
            bucket = initS3(d.key, d.secret);
            uploadOptions = makeBucketUploadObject(d.bucket, fileName, d.acl);
            await mongoDump({host: conf.source.host, port: conf.source.port, username: conf.source.username, password: conf.source.password, database: db, filePath: "./", fileName: "mongotemp.gz"});
            const {Location, ETag} = await uploadToS3("mongotemp.gz", bucket, uploadOptions);
            await deleteTempFile("mongotemp.gz");
            console.log(`S3 Mongo backup uploaded. File URL: ${Location} , ETag: ${ETag}`);
          }
        }
      }
    }
  }
  console.log("done!");
}

const cron_exp = config.options.cron_exp;
if (cron_exp) {
  if (validate(cron_exp)) {
    schedule(cron_exp, () => main());
  } else {
    console.log("Invalid cron expression.");
  }
} else {
  main();
}