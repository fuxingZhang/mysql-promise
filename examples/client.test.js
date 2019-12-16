const { Client } = require('../index');
const config = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '123456',
  database: 'zfx'
};

(async () => {
  const client = new Client(config)
  const { results, fields } = await client.query('SELECT NOW()');
  console.log({ results, fields });
  await client.end();
})().catch(console.error);