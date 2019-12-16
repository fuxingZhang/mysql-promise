'use strict';

const assert = require('assert');
const { Client } = require('../index');

describe('#indexOf()', function () {
  const config = {
    "host": "localhost",
    "port": "3306",
    "user": "root",
    "password": "123456",
    "database": "zfx"
  };
  const table = 'mysql_promise_test';
  const id = 1;
  const username = 'zfx';
  const username2 = 'zfx2';
  const fullname = 'zhangfxuing';
  let client;

  before(async () => {
    client = new Client(config);

    await client.query(`DROP TABLE IF EXISTS ${table}`);

    await client.query(`CREATE TABLE ${table} (
      id int(11) NOT NULL AUTO_INCREMENT,
      username varchar(255) DEFAULT NULL,
      fullname varchar(255) DEFAULT NULL,
      PRIMARY KEY (id)
    )`);
  });

  after(async () => {
    await client.query(`DROP TABLE IF EXISTS ${table}`);
    await client.end();
  });

  it('insert should ok', async () => {
    const res = await client.query(`insert into ?? set id=?, username=?, fullname=?`,
      [table, id, username, fullname]);
    assert(res.results.affectedRows === 1);
  });

  it('query should ok', async () => {
    const res = await client.query('select * from ?? where id=?', [table, 1]);
    assert(res.results);
    assert(res.results.length === 1);
    const row = res.results[0];
    assert(row.id === id);
    assert(row.username === username);
    assert(row.fullname === fullname);
  });

  it('limit should ok', async () => {
    const res = await client.query('select * from ?? limit 0,0', [table]);
    assert(res.results);
    assert(res.results.length === 0);
  });

  it('update should ok', async () => {
    const res1 = await client.query('update ?? set username=? where id=?', [table, username2, 1]);
    assert(res1.results.affectedRows === 1);
    const { results } = await client.query('select * from ?? where id=?', [table, 1]);
    assert(results[0].username, username2);
  });

  it('delete should ok', async () => {
    const res = await client.query('delete from ?? where id=?', [table, 1]);
    assert(res.results.affectedRows === 1);
  });

  it('transaction should ok', async () => {
    const username3 = 'zfx3';
    const username4 = 'zfx4';
    try {
      await client.beginTransaction();
      const res1 = await client.query(`INSERT INTO ${table} SET ?`, {
        id: 2,
        username: username3,
        fullname: 'any'
      });
      assert(res1.results.affectedRows === 1);
      const res2 = await client.query(`INSERT INTO ${table} SET ?`, {
        id: 3,
        username: username4,
        fullname: 'any'
      });
      assert(res2.results.affectedRows === 1);
      await client.commit();
      const res3 = await client.query('select * from ?? where id=?', [table, 2]);
      assert(res3.results[0].username === username3);
      const res4 = await client.query('select * from ?? where id=?', [table, 3]);
      assert(res4.results[0].username === username4);
      const res5 = await client.query('select * from ??', [table]);
      assert(res5.results.length === 2);
    } catch (e) {
      await client.rollback();
      throw e;
    }
  });
});