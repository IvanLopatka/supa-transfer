export type ExtractSchemaName<Database> = ('public' extends keyof Database ? 'public' : string) & Exclude<keyof Database, '__InternalSupabase'>;

export type ExtractTables<
  Database,
  SchemaName extends string & Exclude<keyof Database, '__InternalSupabase'> = ExtractSchemaName<Database>
> = Database[SchemaName] extends { Tables: infer T }
  ? Extract<keyof T, string>
  : string;

export type ExtractColumns<
  Database,
  TableName extends ExtractTables<Database, SchemaName>,
  SchemaName extends string & Exclude<keyof Database, '__InternalSupabase'> = ExtractSchemaName<Database>
> = Database[SchemaName] extends { Tables: Record<TableName, { Row: infer R }> }
  ? Extract<keyof R, string>
  : string;

export type ExtractColumnType<
  Database,
  TableName extends ExtractTables<Database, SchemaName>,
  ColumnName extends ExtractColumns<Database, TableName, SchemaName>,
  SchemaName extends string & Exclude<keyof Database, '__InternalSupabase'> = ExtractSchemaName<Database>
> = Database[SchemaName] extends { Tables: Record<TableName, { Row: Record<ColumnName, infer C> }> }
  ? C extends string | null ? NonNullable<C> : string
  : string;
