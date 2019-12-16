'use strict';

class Client {
  #conn;

  constructor(conn) {
    this.#conn = conn;
  }

  query() {
    return new Promise((resolve, reject) => {
      this.#conn.query(...arguments, function (err, rows, fields) {
        if (err) return reject(err);
        resolve({ rows, fields });
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

  release() {
    this.#conn.release();
  }

  escape(val) {
    return this.#conn.escape(val);
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


