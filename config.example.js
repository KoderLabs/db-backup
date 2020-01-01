module.export = [
  {
    source: {
      type: "mysql",
      host: "127.0.0.1",
      port: "3306",
      username: "root",
      password: "password",
      databases: ["test", "demo"]
    },
    destination: {
      type: "file",
      path: "./",
      name: "a.sql"
    }
  }
];
