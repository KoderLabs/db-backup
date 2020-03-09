module.exports = {
  options: {
    cron_exp: "" //valid cron expression for node-cron. if you dont want to use it, leave it as empty string
  },
  config: [
    {
      source: {
        type: "mysql",
        host: "127.0.0.1",
        port: "3306",
        username: "root",
        password: "password",
        databases: ["test", "demo"] //array of databases for backup
      },
      destination: [
        //array of destinations to create backup (can be multiple of type file or aws)
        {
          type: "file",
          path: "./backups/mysql/",
          name: ".gzip", //name of file with .gzip extension
          name: db => {
            return db + "aaa.gzip";
          },
          zip_password: "test"
        },
        {
          type: "aws", //for uploading backup to s3
          path: "/backups/mysql/",
          name: "a.gzip",
          bucket: "swiftchat.io.dev",
          accessKeyId: "test", // remove to use instance profiles
          secretAccessKey: "test", // remove to use instance profiles
          acl: "private",
          zip_password: "test"
        }
      ]
    },
    {
      source: {
        type: "redis",
        host: "127.0.0.1",
        port: "6379",
        databases: ["0"] //array of databases for backup
      },
      destination: [
        //array of destinations to create backup (can be multiple of type file or aws)
        {
          type: "file",
          path: "./backups/mysql/",
          name: db => {
            return db + "aaa.rdb";
          },
          zip_password: "test"
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
        databases: ["demo"]
      },
      destination: [
        //array of destinations to create backup (can be multiple of type file or aws)
        {
          type: "file",
          path: "./backups/mysql/",
          name: "a.gzip",
          zip_password: "test"
        }
      ]
    }
  ]
};
