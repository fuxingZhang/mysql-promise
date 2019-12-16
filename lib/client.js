'use strict';

const mysql = require('mysql');

class Client {
  #conn;

  constructor(config) {
    this.#conn = mysql.createConnection(config);
  }

  query() {
    return new Promise((resolve, reject) => {
      this.#conn.query(...arguments, function (err, results, fields) {
        if (err) return reject(err);
        resolve({ results, fields });
      })
    });
  }

  end() {
    return new Promise((resolve, reject) => {
      this.#conn.end(function (err) {
        if (err) return reject(err);
        resolve();
      })
    });
  }

  destroy() {
    this.#conn.destroy();
  }

  escape(val) {
    return this.#conn.escape(val);
  }

  getOriginalConnection() {
    return this.#conn;
  }

  beginTransaction() {
    return new Promise((resolve, reject) => {
      this.#conn.beginTransaction(function (err) {
        if (err) return reject(err);
        resolve();
      })
    });
  }

  commit() {
    return new Promise((resolve, reject) => {
      this.#conn.commit(function (err) {
        if (err) return reject(err);
        resolve();
      })
    });
  }

  rollback() {
    return new Promise((resolve, reject) => {
      this.#conn.rollback(function () {
        resolve();
      })
    });
  }
}

module.exports = Client


