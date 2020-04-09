const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;
const timeIntervalConsts = {
  SECONDS,
  MINUTES,
  HOURS,
  DAYS,
};

const consts = {
  parallelSize: 5,
  env: process.env || {},
  timeIntervalConsts,
};

module.exports = consts;
