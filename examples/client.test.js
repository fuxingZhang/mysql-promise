const { Client } = require('../index');
const config = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '123456',
  database: 'zfx',
  connectionLimit : 10,
};

(async () => {
  const client = new Client(config)
  const { rows, fields } = await client.query('SELECT NOW()');
  console.log({ rows, fields });
  await client.end();
})().catch(console.error);