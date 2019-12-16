// 'use strict';

// const assert = require('assert');
// const { Pool } = require('../index');
// const config = {
//   "host": "localhost",
//   "port": "3306",
//   "user": "root",
//   "password": "123456",
//   "database": "zfx"
// };

// (async () => {
//   const client = new Client(config)
//   const { results, fields } = await client.query('SELECT NOW()');
//   console.log({ results, fields });
//   await client.end()

//   // // pools will use environment variables
//   // // for connection information
//   // const pool = new Pool()
//   // pool.query('SELECT NOW()', (err, res) => {
//   //   console.log(err, res)
//   //   pool.end()
//   // })
//   // // you can also use async/await
//   // const res = await pool.query('SELECT NOW()')
//   // await pool.end()
//   // clients will also use environment variables
//   // for connection information
// })().catch(console.error);

// let app;
// const uid = utility.randomString();

// before(() => {
//   app = mm.app({
//     baseDir: 'apps/mysqlapp',
//   });
//   return app.ready();
// });

// beforeEach(function* () {
//   // init test datas
//   try {
//     yield app.mysql.query(`insert into npm_auth set user_id = 'egg-${uid}-1', password = '1'`);
//     yield app.mysql.query(`insert into npm_auth set user_id = 'egg-${uid}-2', password = '2'`);
//     yield app.mysql.query(`insert into npm_auth set user_id = 'egg-${uid}-3', password = '3'`);
//     yield app.mysql.queryOne(`select * from npm_auth where user_id = 'egg-${uid}-3'`);
//   } catch (err) {
//     console.log('init test datas error: %s', err);
//   }
// });

// afterEach(function* () {
//   // 清空测试数据
//   yield app.mysql.query(`delete from npm_auth where user_id like 'egg-${uid}%'`);
// });

// after(done => {
//   app.mysql.end(err => {
//     app.close();
//     done(err);
//   });
// });

// afterEach(mm.restore);

// describe('#indexOf()', function () {
//   const dir = './test/dir';
//   const filename = 'text.js';
//   const filepath = `${dir}/${filename}`;

//   before(() => {
//     fs.mkdirSync(dir);
//     assert(fs.existsSync(dir) === true);

//     fs.writeFileSync(filepath, 'test');
//     assert(fs.existsSync(filepath) === true);
//   });

//   it('rmdir should ok', async () => {
//     try {
//       await rmdir(dir);
//     } catch (error) {
//       assert(false)
//     }

//     assert(fs.existsSync(dir) === false);
//   });
// });