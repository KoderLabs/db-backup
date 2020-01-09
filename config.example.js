//  # ┌────────────── second (optional)
//  # │ ┌──────────── minute
//  # │ │ ┌────────── hour
//  # │ │ │ ┌──────── day of month
//  # │ │ │ │ ┌────── month
//  # │ │ │ │ │ ┌──── day of week
//  # │ │ │ │ │ │
//  # │ │ │ │ │ │
//  # * * * * * *

// expression for cron

module.exports = {
  options: {
    cron_exp: false // valid cron expression for node-cron or false to run once.
  },
  backups: [
    {
      source: {
        type: "mysql",
        host: "127.0.0.1",
        port: "3306",
        username: "root",
        password: "password",
        databases: ["demo", "test"]
      },
      destinations: [
        {
          type: "file",
          path: "./backups/mysql/",
          name: ".sql", //name of file with .sql extension
          name: db => {
            return db + "aaa.sql";
          }
        },
        {
          type: "aws-s3",
          path: "/backups/mysql/",
          name: "a.sql",
          bucket: "swiftchat.io.dev",
          accessKeyId: "test", // remove to use instance profiles
          secretAccessKey: "test", // remove to use instance profiles
          acl: "private"
        }
      ]
    },
    {
      source: {
        type: "redis", 
        host: "127.0.0.1",
        port: "6379",
        databases: ["0"]
      },
      destinations: [
        {
          type: "file",
          path: "./backups/mysql/",
          name: db => {
            return db + "aaa.rdb";
          }
        },
      ]
    },
    {
      source: {
        type: "mongo",
        host: "127.0.0.1",
        port: "27017",
        username: "",
        password: "",
        databases: ["demo"] 
      },
      destinations: [
        {
          type: "file",
          path: "./backups/mysql/",
          name: "a.gzip" 
        },
      ]
    }
  ]
};
