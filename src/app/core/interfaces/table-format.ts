export interface TableHeader {
  label: string;
}

export type KeyValuePair = { [key: string]: string };

export interface TableFormat {
  createTableHeaders(headers: TableHeader[]): void;
}
