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
  const { results, fields } = await pool.query('SELECT NOW()');
  console.log({ results, fields });

  const client = await pool.getConnection();
  try {
    const res1 = await client.query('SELECT * FROM user WHERE id = ?', [1]);
    console.log(res1);
    const res2 = await client.query('SELECT NOW()');
    console.log(res2);
  } finally {
    // Make sure to release the client before any error handling,
    // just in case the error handling itself thresults an error.
    client.release();
    // Don't use the connection here, it has been returned to the pool.
  }

  await pool.end();
})().catch(console.error);