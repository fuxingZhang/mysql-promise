// Type definitions

interface ClientConfig {
  host: string,
  port: string,
  localAddress: string,
  socketPath: string,
  password: string,
  host: string,
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
  rows: any[];
  fields: FieldDef[];
}

export class Client {
  constructor(config?: ClientConfig);

  query(...args: any[]): Promise<QueryResult>;

  end(): Promise<void>;

  destroy(): void;
}
