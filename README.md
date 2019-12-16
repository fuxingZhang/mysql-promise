# @node-mysql/mysql
wrapper for [mysql](https://github.com/mysqljs/mysql),  to make APIs easier to use and promisify

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/@node-mysql/mysql.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@node-mysql/mysql
[travis-image]: https://img.shields.io/travis/eggjs/@node-mysql/mysql.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/@node-mysql/mysql
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/@node-mysql/mysql.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/@node-mysql/mysql?branch=master
[david-image]: https://img.shields.io/david/eggjs/@node-mysql/mysql.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/@node-mysql/mysql
[snyk-image]: https://snyk.io/test/npm/@node-mysql/mysql/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/@node-mysql/mysql
[download-image]: https://img.shields.io/npm/dm/@node-mysql/mysql.svg?style=flat-square
[download-url]: https://npmjs.org/package/@node-mysql/mysql

Node.js 12+ required (Because of use Class private fields)

## Install

```bash
$ npm i @node-mysql/mysql --save
```

## Client  

### example

```js
const { Pool, Client } = require('@node-mysql/mysql');
const config = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '123456'
};

(async () => {
  const client = new Client(config);
  const { rows, fields } = await client.query('SELECT NOW()');
  console.log({ rows, fields });
  await client.end();
})().catch(console.error);
```

### Introduction
* Every method you invoke on a connection is queued and executed in sequence.
* Closing the connection is done using `end()` which makes sure all remaining
  queries are executed before sending a quit packet to the mysql server.

## Connection options

When establishing a connection, you can set the following options:

* `host`: The hostname of the database you are connecting to. (Default:
  `localhost`)
* `port`: The port number to connect to. (Default: `3306`)
* `localAddress`: The source IP address to use for TCP connection. (Optional)
* `socketPath`: The path to a unix domain socket to connect to. When used `host`
  and `port` are ignored.
* `user`: The MySQL user to authenticate as.
* `password`: The password of that MySQL user.
* `database`: Name of the database to use for this connection (Optional).
* `charset`: The charset for the connection. This is called "collation" in the SQL-level
  of MySQL (like `utf8_general_ci`). If a SQL-level charset is specified (like `utf8mb4`)
  then the default collation for that charset is used. (Default: `'UTF8_GENERAL_CI'`)
* `timezone`: The timezone configured on the MySQL server. This is used to type cast server date/time values to JavaScript `Date` object and vice versa. This can be `'local'`, `'Z'`, or an offset in the form `+HH:MM` or `-HH:MM`. (Default: `'local'`)
* `connectTimeout`: The milliseconds before a timeout occurs during the initial connection
  to the MySQL server. (Default: `10000`)
* `stringifyObjects`: Stringify objects instead of converting to values. See
issue [#501](https://github.com/mysqljs/mysql/issues/501). (Default: `false`)
* `insecureAuth`: Allow connecting to MySQL instances that ask for the old
  (insecure) authentication method. (Default: `false`)
* `typeCast`: Determines if column values should be converted to native
   JavaScript types. (Default: `true`)
* `queryFormat`: A custom query format function. See [Custom format](#custom-format).
* `supportBigNumbers`: When dealing with big numbers (BIGINT and DECIMAL columns) in the database,
  you should enable this option (Default: `false`).
* `bigNumberStrings`: Enabling both `supportBigNumbers` and `bigNumberStrings` forces big numbers
  (BIGINT and DECIMAL columns) to be always returned as JavaScript String objects (Default: `false`).
  Enabling `supportBigNumbers` but leaving `bigNumberStrings` disabled will return big numbers as String
  objects only when they cannot be accurately represented with [JavaScript Number objects] (http://ecma262-5.com/ELS5_HTML.htm#Section_8.5)
  (which happens when they exceed the [-2^53, +2^53] range), otherwise they will be returned as
  Number objects. This option is ignored if `supportBigNumbers` is disabled.
* `dateStrings`: Force date types (TIMESTAMP, DATETIME, DATE) to be returned as strings rather than
   inflated into JavaScript Date objects. Can be `true`/`false` or an array of type names to keep as
   strings. (Default: `false`)
* `debug`: Prints protocol details to stdout. Can be `true`/`false` or an array of packet type names
   that should be printed. (Default: `false`)
* `trace`: Generates stack traces on `Error` to include call site of library
   entrance ("long stack traces"). Slight performance penalty for most calls.
   (Default: `true`)
* `multipleStatements`: Allow multiple mysql statements per query. Be careful
  with this, it could increase the scope of SQL injection attacks. (Default: `false`)
* `flags`: List of connection flags to use other than the default ones. It is
  also possible to blacklist default ones. For more information, check
  [Connection Flags](#connection-flags).
* `ssl`: object with ssl parameters or a string containing name of ssl profile. See [SSL options](#ssl-options).

### SSL options

The `ssl` option in the connection options takes a string or an object. When given a string,
it uses one of the predefined SSL profiles included. The following profiles are included:

* `"Amazon RDS"`: this profile is for connecting to an Amazon RDS server and contains the
  certificates from https://rds.amazonaws.com/doc/rds-ssl-ca-cert.pem and
  https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem

When connecting to other servers, you will need to provide an object of options, in the
same format as [tls.createSecureContext](https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options).
Please note the arguments expect a string of the certificate, not a file name to the
certificate. Here is a simple example:

```js
const { Pool, Client } = require('@node-mysql/mysql');
const connection = new Client({
  host : 'localhost',
  ssl  : {
    ca : fs.readFileSync(__dirname + '/mysql-ca.crt')
  }
});
```

You can also connect to a MySQL server without properly providing the appropriate
CA to trust. _You should not do this_.

```js
const { Pool, Client } = require('@node-mysql/mysql');
const connection = new Client({
  host : 'localhost',
  ssl  : {
    // DO NOT DO THIS
    // set up your ca correctly to trust the connection
    rejectUnauthorized: false
  }
});
```

### Connection flags

If, for any reason, you would like to change the default connection flags, you
can use the connection option `flags`. Pass a string with a comma separated list
of items to add to the default flags. If you don't want a default flag to be used
prepend the flag with a minus sign. To add a flag that is not in the default list,
just write the flag name, or prefix it with a plus (case insensitive).

```js
const { Pool, Client } = require('@node-mysql/mysql');
const connection = new Client({
  // disable FOUND_ROWS flag, enable IGNORE_SPACE flag
  flags: '-FOUND_ROWS,IGNORE_SPACE'
});
```

The following flags are available:

- `COMPRESS` - Enable protocol compression. This feature is not currently supported
  by the Node.js implementation so cannot be turned on. (Default off)
- `CONNECT_WITH_DB` - Ability to specify the database on connection. (Default on)
- `FOUND_ROWS` - Send the found rows instead of the affected rows as `affectedRows`.
  (Default on)
- `IGNORE_SIGPIPE` - Don't issue SIGPIPE if network failures. This flag has no effect
  on this Node.js implementation. (Default on)
- `IGNORE_SPACE` - Let the parser ignore spaces before the `(` in queries. (Default on)
- `INTERACTIVE` - Indicates to the MySQL server this is an "interactive" client. This
  will use the interactive timeouts on the MySQL server and report as interactive in
  the process list. (Default off)
- `LOCAL_FILES` - Can use `LOAD DATA LOCAL`. (Default on)
- `LONG_FLAG` - Longer flags in Protocol::ColumnDefinition320. (Default on)
- `LONG_PASSWORD` - Use the improved version of Old Password Authentication.
  (Default on)
- `MULTI_RESULTS` - Can handle multiple resultsets for queries. (Default on)
- `MULTI_STATEMENTS` - The client may send multiple statement per query or
  statement prepare (separated by `;`). This flag is controlled by the connection
  option `multipleStatements`. (Default off)
- `NO_SCHEMA`
- `ODBC` Special handling of ODBC behaviour. This flag has no effect on this Node.js
  implementation. (Default on)
- `PLUGIN_AUTH` - Uses the plugin authentication mechanism when connecting to the
  MySQL server. This feature is not currently supported by the Node.js implementation
  so cannot be turned on. (Default off)
- `PROTOCOL_41` - Uses the 4.1 protocol. (Default on)
- `PS_MULTI_RESULTS` - Can handle multiple resultsets for execute. (Default on)
- `REMEMBER_OPTIONS` - This is specific to the C client, and has no effect on this
  Node.js implementation. (Default off)
- `RESERVED` - Old flag for the 4.1 protocol. (Default on)
- `SECURE_CONNECTION` - Support native 4.1 authentication. (Default on)
- `SSL` - Use SSL after handshake to encrypt data in transport. This feature is
  controlled though the `ssl` connection option, so the flag has no effect.
  (Default off)
- `SSL_VERIFY_SERVER_CERT` - Verify the server certificate during SSL set up. This
  feature is controlled though the `ssl.rejectUnauthorized` connection option, so
  the flag has no effect. (Default off)
- `TRANSACTIONS` - Asks for the transaction status flags. (Default on)

## Terminating connections

There are two ways to end a connection. Terminating a connection gracefully is
done by calling the `end()` method:

```js
// ...
;(async () => {
  const connection = new Client(config);
  // ...
  await connection.end();
})().catch(console.error);
```

This will make sure all previously enqueued queries are still before sending a
`COM_QUIT` packet to the MySQL server. If a fatal error occurs before the
`COM_QUIT` packet can be sent, an `err` argument will be provided to the
callback, but the connection will be terminated regardless of that.

An alternative way to end the connection is to call the `destroy()` method.
This will cause an immediate termination of the underlying socket.
Additionally `destroy()` guarantees that no more events or callbacks will be
triggered for the connection.

```js
// ...
;(async () => {
  const connection = new Client(config);
  await client.query('SELECT NOW()');
  connection.destroy();
})().catch(console.error);
```

Unlike `end()` the `destroy()` method does not throw error.

## Pooling connections

Rather than creating and managing connections one-by-one, this module also
provides built-in connection pooling using `mysql.createPool(config)`.
[Read more about connection pooling](https://en.wikipedia.org/wiki/Connection_pool).

Create a pool and use it directly:

```js
const { Pool } = require('@node-mysql/mysql');
const config = {
  connectionLimit : 10,
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '123456'
};
const pool = new Pool(config);
```  

Single query:

```js  
(async () => {
  const { rows, fields } = await pool.query('SELECT NOW()');
  console.log({ rows, fields });
})().catch(console.error);
```  

check out a client:

```js  
(async () => {
  const client = await pool.getConnection();
  try {
    const res = await client.query('SELECT * FROM users WHERE id = ?', [1]);
    console.log(res.rows[0]);
    const { rows, fields } = await client.query('SELECT NOW()');
    console.log(rows, fields);
  } finally {
    // Make sure to release the client before any error handling,
    // just in case the error handling itself throws an error.
    client.release();
    // Don't use the connection here, it has been returned to the pool.
  }
})().catch(console.error);
```  

If you would like to close the connection and remove it from the pool, use
`connection.destroy()` instead. The pool will create a new connection the next
time one is needed.

Connections are lazily created by the pool. If you configure the pool to allow
up to 100 connections, but only ever use 5 simultaneously, only 5 connections
will be made. Connections are also cycled round-robin style, with connections
being taken from the top of the pool and returning to the bottom.

When a previous connection is retrieved from the pool, a ping packet is sent
to the server to check if the connection is still good.

## Pool options

Pools accept all the same [options as a connection](#connection-options).
When creating a new connection, the options are simply passed to the connection
constructor. In addition to those options pools accept a few extras:

* `acquireTimeout`: The milliseconds before a timeout occurs during the connection
  acquisition. This is slightly different from `connectTimeout`, because acquiring
  a pool connection does not always involve making a connection. If a connection
  request is queued, the time the request spends in the queue does not count
  towards this timeout. (Default: `10000`)
* `waitForConnections`: Determines the pool's action when no connections are
  available and the limit has been reached. If `true`, the pool will queue the
  connection request and call it when one becomes available. If `false`, the
  pool will immediately call back with an error. (Default: `true`)
* `connectionLimit`: The maximum number of connections to create at once.
  (Default: `10`)
* `queueLimit`: The maximum number of connection requests the pool will queue
  before returning an error from `getConnection`. If set to `0`, there is no
  limit to the number of queued connection requests. (Default: `0`)

## Pool events

### acquire

The pool will emit an `acquire` event when a connection is acquired from the pool.
This is called after all acquiring activity has been performed on the connection,
right before the connection is handed to the callback of the acquiring code.

```js
pool.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId);
});
```

### connection

The pool will emit a `connection` event when a new connection is made within the pool.
If you need to set session variables on the connection before it gets used, you can
listen to the `connection` event.

```js
pool.on('connection', function (connection) {
  connection.query('SET SESSION auto_increment_increment=1')
});
```

### enqueue

The pool will emit an `enqueue` event when a callback has been queued to wait for
an available connection.

```js
pool.on('enqueue', function () {
  console.log('Waiting for available connection slot');
});
```

### release

The pool will emit a `release` event when a connection is released back to the
pool. This is called after all release activity has been performed on the connection,
so the connection will be listed as free at the time of the event.

```js
pool.on('release', function (connection) {
  console.log('Connection %d released', connection.threadId);
});
```

## Closing all the connections in a pool

When you are done using the pool, you have to end all the connections or the
Node.js event loop will stay active until the connections are closed by the
MySQL server. This is typically done if the pool is used in a script or when
trying to gracefully shutdown a server. To end all the connections in the
pool, use the `end` method on the pool:

```js
const { Pool } = require('@node-mysql/mysql');
// ...
(async () => {
  const pool = new Pool(config);
  // ...
  await pool.end();
})().catch(console.error);
```

The `end` method takes an _optional_ callback that you can use to know when
all the connections are ended.

**Once `pool.end` is called, `pool.getConnection` and other operations
can no longer be performed.** Wait until all connections in the pool are
released before calling `pool.end`.

`pool.end` calls `connection.end` on every active connection in the pool.
This queues a `QUIT` packet on the connection and sets a flag to prevent
`pool.getConnection` from creating new connections. All commands / queries
already in progress will complete, but new commands won't execute.

## Performing queries

```js
// The simplest form of .query() is .query(sqlString)
await client.query('SELECT * FROM `books` WHERE `author` = "David"');
// The second form .query(sqlString, values) comes when using placeholder values
await client.query('SELECT * FROM `books` WHERE `author` = ?', ['David']);
// The third form .query(options) comes when using various advanced options on the query
await client.query({
  sql: 'SELECT * FROM `books` WHERE `author` = ?',
  timeout: 40000, // 40s
  values: ['David']
});
// Note that a combination of the second and third forms can be used where the placeholder values are passed as an argument and not in the options object. The values argument will override the values in the option object.
await client.query({
    sql: 'SELECT * FROM `books` WHERE `author` = ?',
    timeout: 40000, // 40s
  },
  ['David']
});
// If the query only has a single replacement character (?), and the value is not null, undefined, or an array, it can be passed directly as the second argument to .query:
await client.query('SELECT * FROM `books` WHERE `author` = ?', 'David');
```

pool.query is the same 

```js
await pool.query('SELECT * FROM `books` WHERE `author` = "David"');
await pool.query('SELECT * FROM `books` WHERE `author` = ?', ['David']);
await pool.query({
  sql: 'SELECT * FROM `books` WHERE `author` = ?',
  timeout: 40000, // 40s
  values: ['David']
});
await pool.query({
    sql: 'SELECT * FROM `books` WHERE `author` = ?',
    timeout: 40000, // 40s
  },
  ['David']
});
await pool.query('SELECT * FROM `books` WHERE `author` = ?', 'David');
```

## Escaping query values

**Caution** These methods of escaping values only works when the
[NO_BACKSLASH_ESCAPES](https://dev.mysql.com/doc/refman/5.7/en/sql-mode.html#sqlmode_no_backslash_escapes)
SQL mode is disabled (which is the default state for MySQL servers).

In order to avoid SQL Injection attacks, you should always escape any user
provided data before using it inside a SQL query. You can do so using the
`mysql.escape()`, `connection.escape()` or `pool.escape()` methods:

mysql.escape:

```js
const mysql = require('mysql');
'SELECT * FROM users WHERE id = ' + mysql.escape(userId);
```

connection.escape:

```js
const client = new Client(config);
const userId = 'some user provided value';
const sql    = 'SELECT * FROM users WHERE id = ' + client.escape(userId);
await client.query(sql);
```

pool.escape

```js
const pool = new Pool(config);
const userId = 'some user provided value';
const sql    = 'SELECT * FROM users WHERE id = ' + pool.escape(userId);
await pool.query(sql);
```

Alternatively, you can use `?` characters as placeholders for values you would
like to have escaped like this:

```js
await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
```

Multiple placeholders are mapped to values in the same order as passed. For example,
in the following query `foo` equals `a`, `bar` equals `b`, `baz` equals `c`, and
`id` will be `userId`:

```js
await connection.query('UPDATE users SET foo = ?, bar = ?, baz = ? WHERE id = ?', 
 ['a', 'b', 'c', userId]);
```

This looks similar to prepared statements in MySQL, however it really just uses
the same `connection.escape()` method internally.

**Caution** This also differs from prepared statements in that all `?` are
replaced, even those contained in comments and strings.

Different value types are escaped differently, here is how:

* Numbers are left untouched
* Booleans are converted to `true` / `false`
* Date objects are converted to `'YYYY-mm-dd HH:ii:ss'` strings
* Buffers are converted to hex strings, e.g. `X'0fa5'`
* Strings are safely escaped
* Arrays are turned into list, e.g. `['a', 'b']` turns into `'a', 'b'`
* Nested arrays are turned into grouped lists (for bulk inserts), e.g. `[['a',
  'b'], ['c', 'd']]` turns into `('a', 'b'), ('c', 'd')`
* Objects that have a `toSqlString` method will have `.toSqlString()` called
  and the returned value is used as the raw SQL.
* Objects are turned into `key = 'val'` pairs for each enumerable property on
  the object. If the property's value is a function, it is skipped; if the
  property's value is an object, toString() is called on it and the returned
  value is used.
* `undefined` / `null` are converted to `NULL`
* `NaN` / `Infinity` are left as-is. MySQL does not support these, and trying
  to insert them as values will trigger MySQL errors until they implement
  support.

This escaping allows you to do neat things like this:

```js
const post  = { id: 1, title: 'Hello MySQL' };
const { rows } = await client.query('INSERT INTO posts SET ?', post);
console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
```

And the `toSqlString` method allows you to form complex queries with functions:

```js
const mysql = require('mysql');
const CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };
const sql = mysql.format('UPDATE posts SET modified = ? WHERE id = ?', [CURRENT_TIMESTAMP, 42]);
console.log(sql); // UPDATE posts SET modified = CURRENT_TIMESTAMP() WHERE id = 42
```

To generate objects with a `toSqlString` method, the `mysql.raw()` method can
be used. This creates an object that will be left un-touched when using in a `?`
placeholder, useful for using functions as dynamic values:

**Caution** The string provided to `mysql.raw()` will skip all escaping
functions when used, so be careful when passing in unvalidated input.

```js
const mysql = require('mysql');
const CURRENT_TIMESTAMP = mysql.raw('CURRENT_TIMESTAMP()');
const sql = mysql.format('UPDATE posts SET modified = ? WHERE id = ?', [CURRENT_TIMESTAMP, 42]);
console.log(sql); // UPDATE posts SET modified = CURRENT_TIMESTAMP() WHERE id = 42
```

If you feel the need to escape queries by yourself, you can also use the escaping
function directly:

```js
const mysql = require('mysql');
const query = "SELECT * FROM posts WHERE title=" + mysql.escape("Hello MySQL");

console.log(query); // SELECT * FROM posts WHERE title='Hello MySQL'
```

## Escaping query identifiers

If you can't trust an SQL identifier (database / table / column name) because it is
provided by a user, you should use `??` characters as placeholders for identifiers you would
like to have escaped like this:

```js
const userId = 1;
const columns = ['username', 'email'];
const { rows } = await client.query('SELECT ?? FROM ?? WHERE id = ?', [columns, 'users', userId]);
// SELECT `username`, `email` FROM `users` WHERE id = 1
```

## Getting the id of an inserted row

If you are inserting a row into a table with an auto increment primary key, you
can retrieve the insert id like this:

```js
const { rows, fields } = await connection.query('INSERT INTO posts SET ?', {title: 'test'}); 
console.log(rows.insertId);
```

When dealing with big numbers (above JavaScript Number precision limit), you should
consider enabling `supportBigNumbers` option to be able to read the insert id as a
string, otherwise it will throw an error.

This option is also required when fetching big numbers from the database, otherwise
you will get values rounded to hundreds or thousands due to the precision limit.

## Getting the number of affected rows

You can get the number of affected rows from an insert, update or delete statement.

```js
const { rows, fields } = await connection.query('DELETE FROM posts WHERE title = "wrong"'); 
console.log('deleted ' + rows.affectedRows + ' rows');
```

## Getting the number of changed rows

You can get the number of changed rows from an update statement.

"changedRows" differs from "affectedRows" in that it does not count updated rows
whose values were not changed.

```js
const { rows, fields } = await connection.query('UPDATE posts SET ...'); 
console.log('changed ' + rows.changedRows + ' rows');
```

## Executing queries in parallel

The MySQL protocol is sequential, this means that you need multiple connections
to execute queries in parallel. You can use a Pool to manage connections, one
simple approach is to create one connection per incoming http request.

## Streaming query rows

Sometimes you may want to select large quantities of rows and process each of
them as they are received. This can be done like this:

```js
const client = new Client({ multipleStatements: true });
const pool = new Pool({ multipleStatements: true });

const connection = client.getOriginalConnection();
// or check out from pool
const connection = pool.getOriginalConnection();

const query = connection.query('SELECT * FROM posts');
query
  .on('error', function(err) {
    // Handle error, an 'end' event will be emitted after this as well
  })
  .on('fields', function(fields) {
    // the field packets for the rows to follow
  })
  .on('result', function(row) {
    // Pausing the connnection is useful if your processing involves I/O
    connection.pause();

    processRow(row, function() {
      connection.resume();
    });
  })
  .on('end', function() {
    // all rows have been received
  });
```

Please note a few things about the example above:

* Usually you will want to receive a certain amount of rows before starting to
  throttle the connection using `pause()`. This number will depend on the
  amount and size of your rows.
* `pause()` / `resume()` operate on the underlying socket and parser. You are
  guaranteed that no more `'result'` events will fire after calling `pause()`.
* You MUST NOT provide a callback to the `query()` method when streaming rows.
* The `'result'` event will fire for both rows as well as OK packets
  confirming the success of a INSERT/UPDATE query.
* It is very important not to leave the result paused too long, or you may
  encounter `Error: Connection lost: The server closed the connection.`
  The time limit for this is determined by the
  [net_write_timeout setting](https://dev.mysql.com/doc/refman/5.5/en/server-system-variables.html#sysvar_net_write_timeout)
  on your MySQL server.

Additionally you may be interested to know that it is currently not possible to
stream individual row columns, they will always be buffered up entirely. If you
have a good use case for streaming large fields to and from MySQL, I'd love to
get your thoughts and contributions on this.

### Piping results with Streams

The query object provides a convenience method `.stream([options])` that wraps
query events into a [Readable Stream](http://nodejs.org/api/stream.html#stream_class_stream_readable)
object. This stream can easily be piped downstream and provides automatic
pause/resume, based on downstream congestion and the optional `highWaterMark`.
The `objectMode` parameter of the stream is set to `true` and cannot be changed
(if you need a byte stream, you will need to use a transform stream, like
[objstream](https://www.npmjs.com/package/objstream) for example).

For example, piping query results into another stream (with a max buffer of 5
objects) is simply:

```js
const client = new Client({ multipleStatements: true });
const pool = new Pool({ multipleStatements: true });

// the original connection of https://github.com/mysqljs/mysql mysql.createConnection
const connection = client.getOriginalConnection();
// the original connection of https://github.com/mysqljs/mysql pool.getConnection
const connection = pool.getOriginalConnection();

connection.query('SELECT * FROM posts')
  .stream({highWaterMark: 5})
  .pipe(...);
```

## Multiple statement queries

Support for multiple statements is disabled for security reasons (it allows for
SQL injection attacks if values are not properly escaped). To use this feature
you have to enable it for your connection:

```js
const client = new Client({ multipleStatements: true });
const pool = new Pool({ multipleStatements: true });
```

Once enabled, you can execute multiple statement queries like any other query:

```js
const {rows} = await client.query('SELECT 1; SELECT 2');
// `results` is an array with one element for every statement in the query:
console.log(rows[0]); // [{1: 1}]
console.log(rows[1]); // [{2: 2}]
```

## Stored procedures

You can call stored procedures from your queries as with any other mysql driver.
If the stored procedure produces several result sets, they are exposed to you
the same way as the results for multiple statement queries.

## Joins with overlapping column names

When executing joins, you are likely to get result sets with overlapping column
names.

By default, node-mysql will overwrite colliding column names in the
order the columns are received from MySQL, causing some of the received values
to be unavailable.

However, you can also specify that you want your columns to be nested below
the table name like this:

```js
const options = {sql: '...', nestTables: true};
const {rows} = await connection.query(options);
/* results will be an array like this now:
 * [{
 *   table1: {
 *     fieldA: '...',
 *     fieldB: '...',
 *   },
 *   table2: {
 *     fieldA: '...',
 *     fieldB: '...',
 *   },
 * }, ...]
 */
```

Or use a string separator to have your results merged.

```js
const options = {sql: '...', nestTables: true};
const {rows} = await connection.query(options);
/* results will be an array like this now:
 * [{
 *   table1_fieldA: '...',
 *   table1_fieldB: '...',
 *   table2_fieldA: '...',
 *   table2_fieldB: '...',
 * }, ...]
 */
```

## Transactions

Simple transaction support is available at the connection level:

```js
const pool = new Pool(config);
;(async () => {
  // note: we don't try/catch this because if connecting throws an exception
  // we don't need to dispose of the client (it will be undefined)
  const client = await pool.getConnection();
  try {
    await client.beginTransaction();
    const {rows} = await client.query('INSERT INTO posts SET title=?', title);
    const log = 'Post ' + rows.insertId + ' added';
    await client.query('INSERT INTO log SET data=?', log);
    await client.commit();
  } catch (e) {
    await client.rollback();
    throw e
  } finally {
    // When done with the connection, release it.
    client.release();
  }
})().catch(console.error);
```
Please note that beginTransaction(), commit() and rollback() are simply convenience
functions that execute the START TRANSACTION, COMMIT, and ROLLBACK commands respectively.
It is important to understand that many commands in MySQL can cause an implicit commit,
as described [in the MySQL documentation](http://dev.mysql.com/doc/refman/5.5/en/implicit-commit.html)

## Timeouts

Every operation takes an optional inactivity timeout option. This allows you to
specify appropriate timeouts for operations. It is important to note that these
timeouts are not part of the MySQL protocol, and rather timeout operations through
the client. This means that when a timeout is reached, the connection it occurred
on will be destroyed and no further operations can be performed.

```js
// Kill query after 60s
try {
 await connection.query({sql: 'SELECT COUNT(*) AS count FROM big_table', timeout: 60000});
} catch(error) {
  if (error) {
    if(error.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
      throw new Error('too long to count table rows!');
    } else {
      throw error;
    }
  }
}
```

## Error handling

This module comes with a consistent approach to error handling that you should
review carefully in order to write solid applications.

Most errors created by this module are instances of the JavaScript [Error][]
object. Additionally they typically come with two extra properties:

* `err.code`: String, contains the MySQL server error symbol if the error is
  a [MySQL server error][] (e.g. `'ER_ACCESS_DENIED_ERROR'`), a Node.js error
  code if it is a Node.js error (e.g. `'ECONNREFUSED'`), or an internal error
  code (e.g. `'PROTOCOL_CONNECTION_LOST'`).
* `err.errno`: Number, contains the MySQL server error number. Only populated
  from [MySQL server error][].
* `err.fatal`: Boolean, indicating if this error is terminal to the connection
  object. If the error is not from a MySQL protocol operation, this property
  will not be defined.
* `err.sql`: String, contains the full SQL of the failed query. This can be
  useful when using a higher level interface like an ORM that is generating
  the queries.
* `err.sqlState`: String, contains the five-character SQLSTATE value. Only populated from [MySQL server error][].
* `err.sqlMessage`: String, contains the message string that provides a
  textual description of the error. Only populated from [MySQL server error][].

[Error]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error
[MySQL server error]: https://dev.mysql.com/doc/refman/5.5/en/server-error-reference.html

Fatal errors are propagated to *all* pending callbacks. In the example below, a
fatal error is triggered by trying to connect to an invalid port. Therefore the
error object is propagated to both pending callbacks:

```js
console.log(err.code); // 'ECONNREFUSED'
console.log(err.fatal); // true
```

Note: `'error'` events are special in node. If they occur without an attached
listener, a stack trace is printed and your process is killed.

**tl;dr:** This module does not want you to deal with silent failures. You
should always provide callbacks to your method calls. If you want to ignore
this advice and suppress unhandled errors, you can do this:

```js
connection.on('error', function() {});
```

## Exception Safety

This module is exception safe. That means you can continue to use it, even if
one of your callback functions throws an error which you're catching using
'uncaughtException' or a domain.

## Type casting

For your convenience, this driver will cast mysql types into native JavaScript
types by default. The following mappings exist:

### Number

* TINYINT
* SMALLINT
* INT
* MEDIUMINT
* YEAR
* FLOAT
* DOUBLE

### Date

* TIMESTAMP
* DATE
* DATETIME

### Buffer

* TINYBLOB
* MEDIUMBLOB
* LONGBLOB
* BLOB
* BINARY
* VARBINARY
* BIT (last byte will be filled with 0 bits as necessary)

### String

**Note** text in the binary character set is returned as `Buffer`, rather
than a string.

* CHAR
* VARCHAR
* TINYTEXT
* MEDIUMTEXT
* LONGTEXT
* TEXT
* ENUM
* SET
* DECIMAL (may exceed float precision)
* BIGINT (may exceed float precision)
* TIME (could be mapped to Date, but what date would be set?)
* GEOMETRY (never used those, get in touch if you do)

It is not recommended (and may go away / change in the future) to disable type
casting, but you can currently do so on either the connection:

```js
const client = new Client({typeCast: false});
const pool = new Pool({typeCast: false});
```

Or on the query level:

```js
const options = {sql: '...', typeCast: false};
const { rows } = await client.query(options);
const { rows } = await client.query(options);
```

### Custom type casting

You can also pass a function and handle type casting yourself. You're given some
column information like database, table and name and also type and length. If you
just want to apply a custom type casting to a specific type you can do it and then
fallback to the default.

The function is provided two arguments `field` and `next` and is expected to
return the value for the given field by invoking the parser functions through
the `field` object.

The `field` argument is a `Field` object and contains data about the field that
need to be parsed. The following are some of the properties on a `Field` object:

  * `db` - a string of the database the field came from.
  * `table` - a string of the table the field came from.
  * `name` - a string of the field name.
  * `type` - a string of the field type in all caps.
  * `length` - a number of the field length, as given by the database.

The `next` argument is a `function` that, when called, will return the default
type conversion for the given field.

When getting the field data, the following helper methods are present on the
`field` object:

  * `.string()` - parse the field into a string.
  * `.buffer()` - parse the field into a `Buffer`.
  * `.geometry()` - parse the field as a geometry value.

The MySQL protocol is a text-based protocol. This means that over the wire, all
field types are represented as a string, which is why only string-like functions
are available on the `field` object. Based on the type information (like `INT`),
the type cast should convert the string field into a different JavaScript type
(like a `number`).

Here's an example of converting `TINYINT(1)` to boolean:

```js
new Client({ 
  typeCast: function (field, next) {
    if (field.type === 'TINY' && field.length === 1) {
      return (field.string() === '1'); // 1 = true, 0 = false
    } else {
      return next();
    }
  }
});
// or
new Pool({ 
  typeCast: function (field, next) {
    if (field.type === 'TINY' && field.length === 1) {
      return (field.string() === '1'); // 1 = true, 0 = false
    } else {
      return next();
    }
  }
});
```

__WARNING: YOU MUST INVOKE the parser using one of these three field functions
in your custom typeCast callback. They can only be called once.__

## Debugging and reporting problems

If you are running into problems, one thing that may help is enabling the
`debug` mode for the connection:

```js
new Client({debug: true});
new Pool({debug: true});
```

This will print all incoming and outgoing packets on stdout. You can also restrict debugging to
packet types by passing an array of types to debug:

```js
new Client({debug: ['ComQueryPacket', 'RowDataPacket']});
new Pool({debug: ['ComQueryPacket', 'RowDataPacket']});
```

to restrict debugging to the query and data packets.

If that does not help, feel free to open a GitHub issue. A good GitHub issue
will have:

* The minimal amount of code required to reproduce the problem (if possible)
* As much debugging output and information about your environment (mysql
  version, node version, os, etc.) as you can gather.

## Security issues

Security issues should not be first reported through GitHub or another public
forum, but kept private in order for the collaborators to assess the report
and either (a) devise a fix and plan a release date or (b) assert that it is
not a security issue (in which case it can be posted in a public forum, like
a GitHub issue).

The primary private forum is email, either by emailing the module's author or
opening a GitHub issue simply asking to whom a security issues should be
addressed to without disclosing the issue or type of issue.

An ideal report would include a clear indication of what the security issue is
and how it would be exploited, ideally with an accompanying proof of concept
("PoC") for collaborators to work against and validate potentional fixes against.

## Running unit tests

```bash
$ npm test
```