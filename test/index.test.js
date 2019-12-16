const { Pool, Client } = require('../index');
const config = {
  "host": "localhost",
  "port": "3306",
  "user": "root",
  "password": "123456",
  "database": "zfx"
};

(async () => {
  const client = new Client(config)
  const { rows, fields } = await client.query('SELECT NOW()');
  console.log({ rows, fields });
  await client.end()

  // // pools will use environment variables
  // // for connection information
  // const pool = new Pool()
  // pool.query('SELECT NOW()', (err, res) => {
  //   console.log(err, res)
  //   pool.end()
  // })
  // // you can also use async/await
  // const res = await pool.query('SELECT NOW()')
  // await pool.end()
  // clients will also use environment variables
  // for connection information
})().catch(console.error);