# mysql-promise-plus
wrapper for [mysql](https://github.com/mysqljs/mysql),  to make APIs easier to use and promisify

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/mysql-promise-plus.svg?style=flat-square
[npm-url]: https://npmjs.org/package/mysql-promise-plus
[travis-image]: https://img.shields.io/travis/eggjs/mysql-promise-plus.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/mysql-promise-plus
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/mysql-promise-plus.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/mysql-promise-plus?branch=master
[david-image]: https://img.shields.io/david/eggjs/mysql-promise-plus.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/mysql-promise-plus
[snyk-image]: https://snyk.io/test/npm/mysql-promise-plus/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/mysql-promise-plus
[download-image]: https://img.shields.io/npm/dm/mysql-promise-plus.svg?style=flat-square
[download-url]: https://npmjs.org/package/mysql-promise-plus

## Install

```bash
$ npm i mysql-promise-plus --save
```

## Client  

### example

```js
const { Pool, Client } = require('mysql-promise-plus');
const config = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '123456',
  database: 'zfx'
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
const { Pool, Client } = require('mysql-promise-plus');
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
const { Pool, Client } = require('mysql-promise-plus');
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
const { Pool, Client } = require('mysql-promise-plus');
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
const connection = new Client(config);
connection.destroy();
// or
;(async () => {
  const connection = new Client(config);
  await client.query('SELECT NOW()');
  connection.destroy();
})().catch(console.error);
```

Unlike `end()` the `destroy()` method does not throw error.