const _ = require('lodash');
const moment = require('moment');
const Sequelize = require('sequelize');

const { DataTypes: T } = Sequelize;

const ex = {};

const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

ex.now = () => {
  return moment().format(DATETIME_FORMAT);
};

ex.getFieldType = (vType) => {
  const dict = {
    string: T.STRING,
    date: T.DATEONLY,
    datetime: T.DATE,
    time: T.TIME,
    int: T.INTEGER,
    integer: T.INTEGER,
    text: T.TEXT('long'),
    float: T.FLOAT,
    currency: T.DECIMAL(14, 4),
    tag: T.STRING(25),
    bool: T.BOOLEAN,
    coordinate: T.DECIMAL(8, 4),
  };
  return _.get(dict, vType, dict.string);
};

ex.getListFieldType = (vType) => {
  const dict = {
    string: 'string',
    datetime: 'datetime',
    int: 'number',
    integer: 'number',
    tag: 'tag',
    select: 'tag',
    password: 'password',
    bool: 'tag',
    hidden: 'hidden',
    file: 'hidden',
  };
  return _.get(dict, vType, dict.string);
};

ex.getFormFieldType = (vType) => {
  const dict = {
    id: 'readonly__number',
    string: 'string',
    datetime: 'datetime',
    date: 'date',
    int: 'number',
    integer: 'number',
    tag: 'tag',
    password: 'password',
    bool: 'toggle',
    hidden: 'hidden',
    text: 'text',
    select: 'select',
    file: 'file',
  };
  return _.get(dict, vType, dict.string);
};

ex.getTypeDefaultValue = (vType) => {
  const dict = {
    readonly__id: '',
    string: '',
    datetime: ex.now(),
    int: 0,
    bool: false,
  };
  return _.get(dict, vType, dict.string);
};

module.exports = ex;
