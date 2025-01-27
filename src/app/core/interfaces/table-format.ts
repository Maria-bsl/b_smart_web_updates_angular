export interface TableHeader {
  label: string;
}

export interface TableFormat {
  createTableHeaders(headers: TableHeader[]): void;
}
