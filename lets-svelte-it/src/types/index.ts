export enum AppMode {
  light,
  dark,
}

export type ObjectLiteral = { [key: string]: any };

export type RecordData = { name: string; keys: string[]; values: any[][] };

export type RecordTableType = { index: number; data: ObjectLiteral };

// DefaultResponse
export type DefaultResponse = DefaultResponseOK | DefaultResponseERR;

export type DefaultResponseOK = { status: "OK"; result?: any };

export type DefaultResponseERR = {
  status: "ERR";
  message: string;
  result?: any;
};
