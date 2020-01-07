module.exports = {
  options: {
    cron_exp: "" //valid cron expression for node-cron. if you dont want to use it, leave it as empty string
  },
  backups: [
    {
      source: {
        type: "mysql",
        host: "127.0.0.1",
        port: "3306",
        username: "root",
        password: "password",
        databases: ["test", "demo"] //array of databases for backup
      },
      destinations: [
        //array of destinations to create backup (can be multiple of type file or aws)
        {
          type: "file", //for local backup
          path: "./backups/mysql/", //file path with a trailing forward slash
          name: "a.sql", //name of file with .sql extension
          appendTimestampToFileName: true //add a timestamp to filename
        },
        {
          type: "aws", //for uploading backup to s3
          path: "/backups/mysql/",
          name: "a.sql",
          bucket: "test_bucket",
          key: "aws_access_key",
          secret: "aws_secret",
          acl: "public-read",
          appendTimestampToFileName: true
        }
      ]
    },
    {
      source: {
        type: "redis", //for redis backup
        host: "127.0.0.1",
        port: "6379",
        databases: ["0"] //array of databases for backup
      },
      destinations: [
        //array of destinations to create backup (can be multiple of type file or aws)
        {
          type: "file", //for local backup
          path: "./backups/redis/", //file path with a trailing forward slash
          name: "a.rdb", //name of file with .rdb extension
          appendTimestampToFileName: true //add a timestamp to filename
        },
        {
          type: "aws", //for uploading backup to s3
          path: "/backups/redis/",
          name: "a.rdb",
          bucket: "test_bucket",
          key: "aws_access_key",
          secret: "aws_secret",
          acl: "public-read",
          appendTimestampToFileName: true
        }
      ]
    },
    {
      source: {
        type: "mongo", //for mongodb backup
        host: "127.0.0.1",
        port: "27017",
        username: "",
        password: "",
        databases: ["swiftsales"] //array of databases for backup
      },
      destinations: [
        //array of destinations to create backup (can be multiple of type file or aws)
        {
          type: "file", //for local backup
          path: "./mongo_backups/", //file path with a trailing forward slash
          name: "a.gz" //file name with extension .gz
        },
        {
          type: "aws", //for uploading backup to s3
          path: "/backups/mongo/",
          name: "a.gz",
          bucket: "test_bucket",
          key: "aws_access_key",
          secret: "aws_secret",
          acl: "public-read",
          appendTimestampToFileName: true
        }
      ]
    }
  ]
};
