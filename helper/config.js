const cron = require("node-cron");
const path = require("path");

const getConfig = function() {
  try {
    return require("../config");
  } catch (e) {
    console.error(
      "Error trying to get config file. please use example config to generate config file"
    );
    throw "no config.js found.";
  }
};

const validateCronExp = function(exp) {
  if (exp !== false && !cron.validate(exp)) {
    throw "no false or valid cron expression found";
  }
  return true;
};

const parseConfig = function(config) {
  config.backups = config.backups || [];

  config.options.cron_exp && validateCronExp(config.options.cron_exp);

  const backups = [];
  for (let backup of config.backups) {
    backup.cron_exp =
      backup.source.cron_exp != undefined
        ? backup.source.cron_exp
        : config.options.cron_exp != undefined
        ? config.options.cron_exp
        : false;

    validateCronExp(backup.cron_exp);

    backup.source.temp_dir = path.join(process.cwd(), "temp");

    backup.source.databases.map(function(x) {
      backups.push({
        ...backup,
        source: {
          ...backup.source,
          database: x,
          temp_file_path: path.join(
            backup.source.temp_dir,
            Date.now() + ("" + Math.random()).substr(3)
          )
        }
      });
    });
  }

  return backups;
};

module.exports = {
  parseConfig,
  getConfig
};
