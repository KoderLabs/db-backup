# db-backup

Docker based db backup script.

---

## Instructions

- Install dependencies (docker and docker-compose)
  Instructions can be found at
  - [Docker](https://docs.docker.com/install/)
  - [docker-compose](https://docs.docker.com/compose/install/)
- Edit docker-compose.yml (optional if not using docker-compose) required if your database ports are not bind with host by adding `network` in `services.db-backup.networks` and `networks` with the correct network parameters.

  #### example

  ```
  # before edit

  version: "3"
  services:
    db-backup:
      container_name: db-backup
      build: .
      restart: always
      volumes:
        - ./:/opt/dbbackup
      network_mode: host
  ```

  ```
  # after edit
  version: "3"
  services:
    db-backup:
      container_name: db-backup
      build: .
      restart: always
      volumes:
        - ./:/opt/dbbackup
      networks:
        - mynetwork

  networks:
      mynetwork:
          external: true

  ```

- Copy `config.example.js` to `config.js`
- Edit `config.js` according to the requirements using the configuration document below
- start with `docker-compose up` or `docker run`

---

### Configuration

basic structure

```
module.exports = {
  options: {
    cron_exp: "0 * * * * *"
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
    }
};
```

| Field                                      | Type                    | Description                                                                                            |
| ------------------------------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------ |
| `options`                                  | `object`                | Global option i.e applies on all backup objects                                                        |
| `options.cron_exp`                         | `string\|false`          | Node-cron expression to specify repeat cycle                                                           |
| `backups`                                  | `array`                 | Contains configuration to backup multiple databases                                                    |
| `backups.*.source`                         | `object`                | Contains connection information of the database                                                        |
| `backups.*.source.type`                    | `string`                | allowed values `mysql`,`mongo`,`redis`                                                                 |
| `backups.*.source.host`                    | `string`                | db host name or ip                                                                                     |
| `backups.*.source.port`                    | `string\|number`         | db port                                                                                                |
| `backups.*.source.username`                | `string`                | db username                                                                                            |
| `backups.*.source.password`                | `string`                | db password                                                                                            |
| `backups.*.source.databases`               | `array`                 | db names array                                                                                         |
| `backups.*.source.databases.*`             | `string`                | db name                                                                                                |
| `backups.*.destinations`                   | `array`                 | contains destination configuration objects                                                             |
| `backups.*.destinations.*.type`            | `string`                | allowed values are `file`,`aws-s3` for file & AWS S3 storage respectively                              |
| `backups.*.destinations.*.path`            | `string`                | path where the backuped file will be stored                                                            |
| `backups.*.destinations.*.name`            | `string\|(db) => string` | name of the created file with extension, accepts callback to compute name when saving                  |
| `backups.*.destinations.*.bucket`          | `string`                | Bucket name only used when destination type is `aws-s3`                                                |
| `backups.*.destinations.*.accessKeyId`     | `string`                | accessKeyId only used when destination type is `aws-s3`, do not provide if using instance profiles     |
| `backups.*.destinations.*.secretAccessKey` | `string`                | secretAccessKey only used when destination type is `aws-s3`, do not provide if using instance profiles |
| `backups.*.destinations.*.acl`             | `string`                | acl for the created file. only used when destination type is `aws-s3`.                                 |

