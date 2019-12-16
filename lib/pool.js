'use strict';

const mysql = require('mysql');
const EventEmitter = require('events');
const Client = require('./client.pool');

class Pool extends EventEmitter {
  #pool;

  constructor(config) {
    super();
    this.#pool = mysql.createPool(config);
    this.#pool.on('acquire', connection => {
      this.emit('acquire', connection);
    });
    this.#pool.on('connection', connection => {
      this.emit('connection', connection);
    });
    this.#pool.on('enqueue', connection => {
      this.emit('enqueue', connection);
    });
    this.#pool.on('release', connection => {
      this.emit('release', connection);
    });
  }

  query() {
    return new Promise((resolve, reject) => {
      this.#pool.query(...arguments, function (err, rows, fields) {
        if (err) return reject(err);
        resolve({ rows, fields });
      })
    });
  }

  end() {
    return new Promise((resolve, reject) => {
      this.#pool.end(function (err) {
        if (err) return reject(err);
        resolve();
      })
    });
  }

  getConnection() {
    return new Promise((resolve, reject) => {
      this.#pool.getConnection(function (err, connection) {
        if (err) return reject(err);
        const client = new Client(connection);
        resolve(client);
      })
    });
  }

  escape(val) {
    return this.#pool.escape(val);
  }

  getOriginalConnection() {
    return new Promise((resolve, reject) => {
      this.#pool.getConnection(function (err, connection) {
        if (err) return reject(err);
        resolve(connection);
      })
    });
  }
}

module.exports = Pool


