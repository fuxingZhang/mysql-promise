// Type definitions

export interface ClientConfig {
  host: string,
  port: string,
  localAddress: string,
  socketPath: string,
  password: string,
  database: string,
  charset: string,
  timezone: string,
  connectTimeout: string,
  stringifyObjects: string,
  insecureAuth: string,
  typeCast: string,
  queryFormat: string,
  supportBigNumbers: string,
  bigNumberStrings: string,
  dateStrings: string,
  debug: string,
  trace: string,
  flags: string,
  ssl: string,
}

export interface FieldDef {
  catalog: string,
  db: string,
  table: string,
  name: string,
  orgName: string,
  charsetNr: number,
  length: number,
  type: number,
  flags: number,
  decimals: number,
  default: any,
  zeroFill: boolean,
  protocol41: boolean
}

export interface QueryResult {
  results: any[];
  fields: FieldDef[];
}

export class Client {
  /**
   * When establishing a connection, you can set the following options:
   * 
   * - `host`: The hostname of the database you are connecting to. (Default:
   *   `localhost`)
   * - `port`: The port number to connect to. (Default: `3306`)
   * - `localAddress`: The source IP address to use for TCP connection. (Optional)
   * - `socketPath`: The path to a unix domain socket to connect to. When used `host`
   *   and `port` are ignored.
   * - `user`: The MySQL user to authenticate as.
   * - `password`: The password of that MySQL user.
   * - `database`: Name of the database to use for this connection (Optional).
   * - `charset`: The charset for the connection. This is called "collation" in the SQL-level
   *   of MySQL (like `utf8_general_ci`). If a SQL-level charset is specified (like `utf8mb4`)
   *   then the default collation for that charset is used. (Default: `'UTF8_GENERAL_CI'`)
   * - `timezone`: The timezone configured on the MySQL server. This is used to type cast server date/time values to JavaScript `Date` object and vice versa. This can be `'local'`, `'Z'`, or an offset in the form `+HH:MM` or `-HH:MM`. (Default: `'local'`)
   * - `connectTimeout`: The milliseconds before a timeout occurs during the initial connection
   *   to the MySQL server. (Default: `10000`)
   * - `stringifyObjects`: Stringify objects instead of converting to values. See
   * issue [#501](https://github.com/mysqljs/mysql/issues/501). (Default: `false`)
   * - `insecureAuth`: Allow connecting to MySQL instances that ask for the old
   *   (insecure) authentication method. (Default: `false`)
   * - `typeCast`: Determines if column values should be converted to native
   *    JavaScript types. (Default: `true`)
   * - `queryFormat`: A custom query format function. See [Custom format](#custom-format).
   * - `supportBigNumbers`: When dealing with big numbers (BIGINT and DECIMAL columns) in the database,
   *   you should enable this option (Default: `false`).
   * - `bigNumberStrings`: Enabling both `supportBigNumbers` and `bigNumberStrings` forces big numbers
   *   (BIGINT and DECIMAL columns) to be always returned as JavaScript String objects (Default: `false`).
   *   Enabling `supportBigNumbers` but leaving `bigNumberStrings` disabled will return big numbers as String
   *   objects only when they cannot be accurately represented with [JavaScript Number objects] (http://ecma262-5.com/ELS5_HTML.htm#Section_8.5)
   *   (which happens when they exceed the [-2^53, +2^53] range), otherwise they will be returned as
   *   Number objects. This option is ignored if `supportBigNumbers` is disabled.
   * - `dateStrings`: Force date types (TIMESTAMP, DATETIME, DATE) to be returned as strings rather than
   *    inflated into JavaScript Date objects. Can be `true`/`false` or an array of type names to keep as
   *    strings. (Default: `false`)
   * - `debug`: Prints protocol details to stdout. Can be `true`/`false` or an array of packet type names
   *    that should be printed. (Default: `false`)
   * - `trace`: Generates stack traces on `Error` to include call site of library
   *    entrance ("long stack traces"). Slight performance penalty for most calls.
   *    (Default: `true`)
   * - `multipleStatements`: Allow multiple mysql statements per query. Be careful
   *   with this, it could increase the scope of SQL injection attacks. (Default: `false`)
   * - `flags`: List of connection flags to use other than the default ones. It is
   *   also possible to blacklist default ones. For more information, check
   *   [Connection Flags](#connection-flags).
   * - `ssl`: object with ssl parameters or a string containing name of ssl profile. See [SSL options](#ssl-options).
   */
  constructor(config?: ClientConfig);

  query(...args: any[]): Promise<QueryResult>;

  end(): Promise<void>;

  destroy(): void;

  getOriginalConnection(): any;

  escape(val: string): string;

  beginTransaction(): Promise<void>;

  commit(): Promise<void>;

  rollback(): Promise<void>;
}

export interface PoolConfig extends ClientConfig{
  acquireTimeout: string,
  waitForConnections: string,
  connectionLimit: string,
  queueLimit: string,
}

export interface PoolClient {
  query(...args: any[]): Promise<QueryResult>;

  end(): Promise<void>;

  destroy(): void;

  release(): void;

  escape(val: string): string;

  beginTransaction(): Promise<void>;

  commit(): Promise<void>;

  rollback(): Promise<void>;
}

export class Pool {
  /**
   * Pools accept all the same [options as a connection](#connection-options).
   * When creating a new connection, the options are simply passed to the connection
   * constructor. In addition to those options pools accept a few extras:
   * 
   * Options:
   *   - `acquireTimeout`: The milliseconds before a timeout occurs during the connection
   *      acquisition. This is slightly different from `connectTimeout`, because acquiring
   *      a pool connection does not always involve making a connection. If a connection
   *      request is queued, the time the request spends in the queue does not count
   *      towards this timeout. (Default: `10000`)
   *   - `waitForConnections`: Determines the pool's action when no connections are
   *      available and the limit has been reached. If `true`, the pool will queue the
   *      connection request and call it when one becomes available. If `false`, the
   *      pool will immediately call back with an error. (Default: `true`)
   *   - `connectionLimit`: The maximum number of connections to create at once. (Default: `10`)
   *   - `queueLimit`: The maximum number of connection requests the pool will queue
   *      before returning an error from `getConnection`. If set to `0`, there is no
   *      limit to the number of queued connection requests. (Default: `0`)
   */
  constructor(config?: PoolConfig);

  query(...args: any[]): Promise<QueryResult>;

  end(): Promise<void>;

  getConnection(): Promise<PoolClient>;

  escape(val: string): string;

  getOriginalConnection(): Promise<any>;
}