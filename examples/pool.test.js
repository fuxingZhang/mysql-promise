const { Pool } = require('../index');
const config = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '123456',
  database: 'zfx',
  connectionLimit : 10,
};

(async () => {
  const pool = new Pool(config);
  const { rows, fields } = await pool.query('SELECT NOW()');
  console.log({ rows, fields });
  await pool.end();
})().catch(console.error);