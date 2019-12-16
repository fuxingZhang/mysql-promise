'use strict';

const mysql = require('mysql');
const assert = require('assert');

class Client {
  constructor(config) {
    this.conn = mysql.createConnection(config);
  }

  query() {
    return new Promise((resolve, reject) => {
      this.conn.query(...arguments, function (err, rows, fields) {
        if (err) return reject(err);
        resolve({ rows, fields });
      })
    });
  }

  end() {
    return new Promise((resolve, reject) => {
      this.conn.end(function (err) {
        if (err) return reject(err);
        resolve();
      })
    });
  }

  destroy() {
    this.conn.destroy();
  }
}

module.exports = Client


